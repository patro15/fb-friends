import org.json.JSONArray;
import org.json.JSONObject;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;

/**
 * Created by Patryk on 2016-05-23.
 */
public class Ranking {

	public static JSONObject toJSON(Connection connection) throws SQLException {
		JSONObject rank = new JSONObject();
		JSONArray table = new JSONArray();

		Statement statement = connection.createStatement();
		ResultSet result = statement.executeQuery("select name,date,part1Num,part2Num,correctness from results" +
				" order by correctness desc");

		while(result.next()) {
			JSONObject row = new JSONObject();
			row.put("name", result.getString(1));
			row.put("date", new SimpleDateFormat("yy.dd.MM HH:mm").format(result.getTimestamp(2)));
			row.put("part1Num", result.getInt(3));
			row.put("part2Num", result.getInt(4));
			row.put("correctness", result.getDouble(5));
			table.put(row);
		}
		rank.put("table", table);
		return rank;
	}
}
