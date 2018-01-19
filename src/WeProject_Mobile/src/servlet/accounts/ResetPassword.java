package servlet.accounts;



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

public class ResetPassword extends HttpServlet {

	

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
		Date beginDate = new Date();
		Date endDate = null;
		resp.setContentType("application/json; charset=utf-8");
		resp.setCharacterEncoding("UTF-8");
		Connection conn = null;
		PreparedStatement ps = null;
		PrintWriter writer = resp.getWriter();
		JSONObject jObject = null;
		if(!HttpUtil.doBeforeProcessing(req)){
			endDate = new Date();
			jObject = HttpUtil.getResponseJson(false, null,
					endDate.getTime() - beginDate.getTime(), Constant.COMMON_ERROR,0,1,-1);
			writer.append(jObject.toString());
			writer.close();
			return;
		}
		
		String pJasonStr = GetRequestJsonUtils.getRequestJsonString(req);
		JSONObject object;
		String oldpsd = null;
		String newpsd = null;
		String userName = null;
		try {
			conn = DBController.getConnection();
			object = new JSONObject(pJasonStr);
			
			oldpsd = ((String) object.get("OldPassword")).trim();
			newpsd =((String) object.get("NewPassword")).trim();
			Cookie[] cookies = req.getCookies();
			if (cookies != null) {
				for (Cookie c : cookies) {
					if (c.getName().equals("username")) {
						userName = c.getValue();
					}
				}
			}
			ps = conn.prepareStatement(Constant.SQL_SELECT_USER);
			ps.setString(1, userName);
			ps.setString(2, oldpsd);
			//rs = ps.executeQuery();
			JSONArray array = DBController.getJsonArray(ps, conn);
			array.length();
			endDate = new Date();
			if (array.length()<=0||newpsd==null||newpsd.equals("")) {
				jObject = HttpUtil.getResponseJson(false, null,
						endDate.getTime() - beginDate.getTime(), Constant.PASSWORD_ERROR,0,1,-1);
				writer.append(jObject.toString());
				return;
			}
			ps = conn.prepareStatement(Constant.SQL_RESET_PASSWORD);
			
			ps.setString(1, newpsd);
			ps.setString(2, userName);

			int itemCount = ps.executeUpdate();
			endDate = new Date();
			if(itemCount<=0){
				jObject = HttpUtil.getResponseJson(false, null,
						endDate.getTime() - beginDate.getTime(), Constant.DATEBASE_ERROR,0,1,-1);
				writer.append(jObject.toString());
			}else
			{
				jObject = HttpUtil.getResponseJson(true, null, endDate.getTime() - beginDate.getTime(), null,0,1,-1);
				writer.append(jObject.toString());
			}

			writer.close();
			DBController.ReleaseConnection(conn);
		} catch (SQLException | JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}

