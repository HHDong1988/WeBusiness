import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

import org.json.JSONArray;
import org.json.JSONObject;

public class Main {
	public static void main(String[] args){
        System.out.println("Hello World!");
        Date beginDate = new Date();
		Date endDate = null;
		String userName = "Bobby";
		String psd = "111";
		Connection conn = DBController.getConnection();
		PreparedStatement ps = null;
		ResultSet rs = null;
		
		try {
			ps = conn.prepareStatement(Constant.SQL_SELECT_USER);
			
			ps.setString(1, userName);
			ps.setString(2, psd);
			JSONArray array = DBController.getJsonArray(ps, conn);
			array.length();
			//rs = ps.executeQuery();
			endDate = new Date();
			//if (rs.next()) {
			//	System.out.println("Exist");
			//	//resp.sendRedirect("home.html");
			//} else {
			//	System.out.println("Not Exist");
			//}
			
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}
