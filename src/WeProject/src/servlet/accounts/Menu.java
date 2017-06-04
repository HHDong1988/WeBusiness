package servlet.accounts;



import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

public class Menu extends HttpServlet {

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
		Cookie[] cookies = req.getCookies();
		String username = null;
		String tokenStr = null;
		if (cookies != null) {
			for (Cookie c : cookies) {
				if (c.getName().equals("username")) {
					username = c.getValue();
				}
				if (c.getName().equals("token")) {
					tokenStr = c.getValue();
				}
			}
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
			ps = conn.prepareStatement(Constant.SQL_SELECT_USERTypeId);
			ps.setString(1, username);
			//rs = ps.executeQuery();
			JSONArray array = DBController.getJsonArray(ps, conn);
			array.length();
			endDate = new Date();
			if (array.length()>0) {
				JSONObject userobject = array.getJSONObject(0);
				int usertypeid = userobject.getInt("UserTypeID");
				List<String> menulist =RoleMenuMap.GetMenuList(usertypeid);
				JSONArray jsonarray = new JSONArray();
				jsonarray.put(menulist);
				jObject = HttpUtil.getResponseJson(true, jsonarray.getJSONArray(0), endDate.getTime() - beginDate.getTime(), null,0,1,-1);
				
				writer.append(jObject.toString());
				//resp.sendRedirect("home.html");
			} else {
				jObject = HttpUtil.getResponseJson(false, null,
						endDate.getTime() - beginDate.getTime(), Constant.COMMON_ERROR,0,1,-1);
				writer.append(jObject.toString());
			}
			
			writer.close();
			conn.close();
		} catch (SQLException | JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
