import java.net.URISyntaxException;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Date;

import static spark.Spark.*;

import org.json.JSONObject;
import spark.template.freemarker.FreeMarkerEngine;
import spark.ModelAndView;

import static spark.Spark.get;

public class Main {

	private static class AuthorizationException extends Exception {
		public AuthorizationException(String s) {
			super(s);
		}
	}

	static class AccessSingleRowByTokenException extends Exception {}

	private static String generateToken(int seed) {
		Random random = new Random();
		String token = String.valueOf(seed);
		token +=  new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss").format(new Date());
		StringBuilder sb = new StringBuilder();
		for(int i=0;i<20;i++)
			sb.append(random.nextInt(10000));
		token+=sb;
		return token;
	}

	private static String addData(String name, Double correctness, Integer part1Num, Integer part2Num) throws Exception {
		Connection connection = ConnectionProvider.getCurrentConnection();
		String token = generateToken(0);
		Statement stmt = connection.createStatement();
		stmt.executeUpdate("CREATE TABLE IF NOT EXISTS Results (" +
				"date timestamp," +
				"name text," +
				"part1Num int," +
				"part2Num int," +
				"accessToken text," +
				"correctness real)");
		PreparedStatement pst = connection.prepareStatement("INSERT INTO Results VALUES (" +
				"now(), ?, ?, ?, ?, ?)");
		pst.setString(1, name);
		pst.setInt(2, part1Num);
		pst.setInt(3, part2Num);
		pst.setString(4, token);
		pst.setDouble(5, correctness);
		pst.execute();
		return token;
	}

	static boolean checkToken(String token, Connection connection) throws SQLException, AuthorizationException {
		PreparedStatement pst = connection.prepareStatement("Select COUNT(*) from Results where accessToken=?");
		pst.setString(1, token);
		ResultSet resultSet = pst.executeQuery();
		resultSet.next();
		int rowCount = resultSet.getInt(1);
		if(rowCount==0) throw new AuthorizationException("Token invalid");
		return rowCount==1;
	}

	private static void changeName(String name, String token) throws Exception {
		Connection connection = ConnectionProvider.getCurrentConnection();
		if(!checkToken(token, connection)) throw new AccessSingleRowByTokenException();
		PreparedStatement pst = connection.prepareStatement("UPDATE Results SET name = ? WHERE accessToken = ?;");
		pst.setString(1, name);
		pst.setString(2, token);
		pst.executeUpdate();
	}

	public static void main(String[] args) {

		port(Integer.valueOf(System.getenv("PORT")));
		staticFileLocation("/public");

		get("/", (request, response) -> {
			Map<String, Object> attributes = new HashMap<>();
			return new ModelAndView(attributes, "index.htm");
		}, new FreeMarkerEngine());

		get("/game", (request, response) -> {
			Map<String, Object> attributes = new HashMap<>();
			return new ModelAndView(attributes, "game.htm");
		}, new FreeMarkerEngine());

		get("/ranking", (request, response) -> new ModelAndView(null, "ranking.htm"),
				new FreeMarkerEngine());

		post("/game/results", (request, response) -> {
			JSONObject json = new JSONObject(request.body());
			JSONObject part1 = json.has("part1") ? json.getJSONObject("part1") : null;
			JSONObject part2 = json.has("part2") ? json.getJSONObject("part2") : null;
			String name = json.getString("name");
			Double correctness = json.getDouble("correctness");
			Integer part1Num = part1 != null ? part1.getInt("numAnswered") : null;
			Integer part2Num = part2 != null ? part2.getInt("numAnswered") : null;

			JSONObject jsonRes = new JSONObject();
			try {
				String token = addData(name, correctness, part1Num, part2Num);
				jsonRes.put("token", token);
				jsonRes.put("success", true);
			} catch (Exception e) {
				jsonRes.put("message", "Cannot save results on server");
				jsonRes.put("success", false);
				e.printStackTrace();
			}
			return jsonRes.toString();
		});

		post("game/results/name", ((request, response) -> {
			JSONObject json = new JSONObject(request.body());
			String name = json.getString("name");
			String token = json.getString("token");
			JSONObject jsonRes = new JSONObject();
			try {
				changeName(name, token);
				jsonRes.put("success", true);
			} catch (AuthorizationException e) {
				jsonRes.put("success", false);
				jsonRes.put("message", "User not authorized");
			} catch (Exception e) {
				jsonRes.put("success", false);
				e.printStackTrace();
			}
			return jsonRes.toString();
		}));

		get("game/results", ((request, response) -> {
			JSONObject rank = null;
			JSONObject jsonRes = new JSONObject();
			try {
				rank = Ranking.toJSON(ConnectionProvider.getCurrentConnection());
				jsonRes.put("rank", rank);
				jsonRes.put("success", true);
			} catch(Exception e) {
				jsonRes.put("success", false);
			}
			return jsonRes;
		}));

	}
}
