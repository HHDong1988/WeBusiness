package com.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.constant.Constant;
import com.database.DBController;

public class HttpUtil {
	public static JSONObject getResponseJson(boolean success, JSONArray jArray,
			Long time, String description,int total,int page, int pageSize) {
		JSONObject resultJObject = new JSONObject();
		jArray = jArray == null ? new JSONArray() : jArray;
		description = description == null ? "" : description;
		try {
			resultJObject.put("success", success);
			resultJObject.put("data", jArray);
			resultJObject.put("time", time);
			resultJObject.put("description", description);
			resultJObject.put("total", total);
			resultJObject.put("page", page);
			resultJObject.put("pageSize", pageSize);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return resultJObject;
	}

	public static boolean doBeforeProcessing(HttpServletRequest request) {
		// 首先检查session，若已经登陆则直接忽略一下代码
		Cookie[] cookies = request.getCookies();
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
		if (username == null) {
			return false;
		}
		String mD5str = (String)request.getSession(true).getAttribute(username);
		if (mD5str == null) {
			return false;
		}
		
		if (tokenStr.equals(mD5str)) {
			return true;
		} else {
			return false;
		}

	}
	
	public static boolean isUserValid(String username, String password){
		Connection conn = DBController.getConnection();
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = conn.prepareStatement(Constant.SQL_SELECT_USER);
			ps.setString(1, username);
			ps.setString(2, password);
			rs = ps.executeQuery();
			if (rs.next()) {
				return true;
			} else {
				return false;
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}
}
