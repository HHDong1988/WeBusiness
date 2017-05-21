package com.database;

import java.io.Console;
import java.sql.*;

import org.json.JSONArray;
import org.json.JSONObject;

public class DBController {
	private static String driverName = "com.mysql.jdbc.Driver"; // 定义私有字符串常量并初始化
	private static String username = "root"; // 定义的数据库用户名
	private static String password = "lovelf521"; // 定义的数据库连接密码
//	private static String dbName = "family"; // 定义的数据库名
	private static String url = "jdbc:mysql://localhost:3306/webusiness";
	
	public static JSONArray getJsonArray(PreparedStatement ps, Connection conn){
		JSONArray jArray = new JSONArray();
		
		ResultSet rs = null;
		ResultSetMetaData  rsMetaData = null;
		int columnCount = 0;
		try {
			rs = ps.executeQuery();
			
			while (rs.next()) {
				rsMetaData = rs.getMetaData();
				columnCount = rsMetaData.getColumnCount();
				JSONObject jObject = new JSONObject();
				for (int i = 1; i <= columnCount; i++) {
					jObject.put(rsMetaData.getColumnName(i), rs.getObject(i));
				}
				jArray.put(jObject);
			}
			rs.close();
			ps.close();
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
		return jArray;
	}
	
	public static JSONObject getJson(String sql){
		getConnection();
		return null;
	}
	
	public static ResultSet getResultSet(PreparedStatement ps, Connection conn){
		ResultSet rs = null;
		try {
			rs = ps.executeQuery();
			return rs;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
	}
	
	public static Connection getConnection(){
		Connection conn;
		try {
			Class.forName(driverName);;
			conn = DriverManager.getConnection(url, username, password);
			return conn;
		} catch (Exception e) {
			return null;
		}
		
	}
}
