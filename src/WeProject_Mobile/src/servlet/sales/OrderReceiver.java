package servlet.sales;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.constant.Constant;
import com.database.DBController;
import com.util.GetRequestJsonUtils;
import com.util.HttpUtil;

public class OrderReceiver extends HttpServlet{
	private static final long serialVersionUID = 1L;
	
	private int getUserID(HttpServletRequest req,Connection conn){
		Cookie[] cookies = req.getCookies();
		String username = null;
		if (cookies != null) {
			for (Cookie c : cookies) {
				if (c.getName().equals("username")) {
					username = c.getValue();
				}
			}
			PreparedStatement ps = null;
			try {
				ps = conn.prepareStatement(Constant.SQL_SELECT_USERIDBYNAME);
				ps.setString(1, username);
				int id = DBController.getIntNumber(ps, conn);
				return id;
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return -1;
			}
			
				
		}
		return -1;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		// super.doGet(req, resp);
		JSONArray resultarray =null;
		Date beginDate = new Date();
		Date endDate = null;
		resp.setContentType("application/json; charset=utf-8");
		resp.setCharacterEncoding("UTF-8");
		Connection conn = null;
		PreparedStatement ps = null;
		PrintWriter writer = resp.getWriter();
		JSONObject jObject = null;
//		if(!HttpUtil.doBeforeProcessing(req)){
//			endDate = new Date();
//			jObject = HttpUtil.getResponseJson(false, null,
//					endDate.getTime() - beginDate.getTime(), Constant.COMMON_ERROR,0,1,-1);
//			writer.append(jObject.toString());
//			writer.close();
//			return;
//		}
		
		try {
			conn = DBController.getConnection();
			int salerID = getUserID(req,conn);
			ps = conn.prepareStatement(Constant.SQL_GET_RECEIVERBYSALERID);
        	ps.setInt(1, salerID);
			resultarray = DBController.getJsonArray(ps, conn);

			endDate = new Date();
			if(resultarray==null||(resultarray!=null&&resultarray.length()==0)){
				jObject = HttpUtil.getResponseJson(false, null,
						endDate.getTime() - beginDate.getTime(), Constant.DATEBASEEMPTY_ERROR,0,1,-1);
				writer.append(jObject.toString());
			}else
			{
				jObject = HttpUtil.getResponseJson(true, resultarray, endDate.getTime() - beginDate.getTime(), null,-1,-1,-1);
				writer.append(jObject.toString());
			}

			writer.close();
			conn.close();
		} catch (SQLException  e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
