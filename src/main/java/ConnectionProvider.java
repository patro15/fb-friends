import com.heroku.sdk.jdbc.DatabaseUrl;

import java.net.URISyntaxException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Created by Patryk on 2016-05-22.
 */
public class ConnectionProvider {

	public static Connection getHerokuDatabaseConnection() throws URISyntaxException, SQLException {
		return DatabaseUrl.extract().getConnection();
	}

	public static Connection getLocalDatabaseConnection() throws ClassNotFoundException, SQLException {
		Connection c = null;
			Class.forName("org.postgresql.Driver");
			c = DriverManager.getConnection("jdbc:postgresql://localhost:5433/testdb",
							"postgres", "123");

		System.out.println("Opened database successfully");
		return c;
	}

	public static Connection getCurrentConnection() throws Exception {
		return getHerokuDatabaseConnection();
	}
}
