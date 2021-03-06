

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.*;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.constant.Constant;
import com.database.DBController;
import com.util.*;

public class LogInSystem extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		// super.doGet(req, resp);
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		// super.doPost(req, resp);
		Date beginDate = new Date();
		Date endDate = null;
		String pJasonStr = GetRequestJsonUtils.getRequestJsonString(req);

		JSONObject object;
		String userName = null;
		String psd = null;
		try {
			object = new JSONObject(pJasonStr);
			userName = ((String) object.get("username")).trim();
			psd = ((String) object.get("password")).trim();
		} catch (JSONException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		//String userName = req.getParameter("username").trim();
		//String psd = MD5Util.MD5(req.getParameter("password")).trim();
		//String psd = req.getParameter("password").trim();
		//String userName = "Bobby";
		//String psd = "111";
		Connection conn = DBController.getConnection();
		PreparedStatement ps = null;
		ResultSet rs = null;
		PrintWriter writer = resp.getWriter();
		JSONObject jObject = null;
		resp.setContentType("application/json; charset=utf-8");
		resp.setCharacterEncoding("UTF-8");
		try {
			ps = conn.prepareStatement(Constant.SQL_SELECT_USER);
			ps.setString(1, userName);
			ps.setString(2, psd);
			//rs = ps.executeQuery();
			JSONArray array = DBController.getJsonArray(ps, conn);
			array.length();
			endDate = new Date();
			if (array.length()>0) {
				JSONObject userobject = array.getJSONObject(0);
				int usertypeid = userobject.getInt("UserTypeID");
				jObject = HttpUtil.getResponseJson(true, array, endDate.getTime() - beginDate.getTime(), null,0,1,-1);
				
				resp.addCookie(HttpUtil.GetCookie("UserTypeId", String.valueOf(usertypeid), 600));
				resp.addCookie(HttpUtil.GetCookie("username", userName, 600));
				String tokenstr =  MD5Util.MD5(userName).trim();
				resp.addCookie(HttpUtil.GetCookie("token", tokenstr, 600));
				
				HttpSession session = req.getSession(true);
				session.setMaxInactiveInterval(900);
				session.setAttribute(userName, tokenstr);
				
				writer.append(jObject.toString());
				//resp.sendRedirect("home.html");
			} else {
				jObject = HttpUtil.getResponseJson(false, null,
						endDate.getTime() - beginDate.getTime(), Constant.LOGIN_ERROR,0,1,-1);
				writer.append(jObject.toString());
			}
			
			ps = conn.prepareStatement(Constant.SQL_UPDATE_USERLOGINTIME);
			java.sql.Timestamp sqlDate=new java.sql.Timestamp(beginDate.getTime());
			ps.setString(2, userName);
			ps.setObject(1, sqlDate);
			ps.executeUpdate();
			writer.close();
			conn.close();
		} catch (SQLException | JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
