package com.database;

import java.io.Console;
import java.sql.*;
import java.util.ArrayList;
import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.constant.Constant;

public class DBController {
	private static String driverName = "com.mysql.jdbc.Driver"; // 定义私有字符串常量并初始化
	private static String username = "root"; // 定义的数据库用户名
	private static String password = "fish1122"; // 定义的数据库连接密码
//	private static String dbName = "family"; // 定义的数据库名
	private static String url = "jdbc:mysql://localhost:3306/microbussiness";
	
	public static Boolean ExecuteMultipleUpdate(Connection conn, String tableName,
			JSONArray array, String keyId)
	{
//		"UPDATE sys_conf_userinfo "
//				+ "SET Password = ?, RealName = ?, Tel = ?, Address = ? "
		try {
			for(int i=0;i<array.length();i++)
			{
				JSONObject object = (JSONObject) array.get(i);
				if(object==null)continue;
				int objectKeyCount=0;
				String whereStatement="WHERE " +keyId +"= ?";
				Object whereValue=null;
				StringBuilder sqlstatementBuilder= new StringBuilder(100);
				sqlstatementBuilder.append("UPDATE ");
				sqlstatementBuilder.append(tableName);
				Iterator iterator = object.keys();
				ArrayList<String>  targetProperties=new ArrayList<String> ();
				ArrayList targetValues=new ArrayList();
				int setAreaCount=0;
				while(iterator.hasNext()){

			        String key = (String) iterator.next();
			        Object value = object.get(key);
			        if(keyId.equals(key)){
			        	whereValue = value;
			        	continue;
			        }
			        if(setAreaCount==0)
			        {
			        	sqlstatementBuilder.append(" SET ");
			        	sqlstatementBuilder.append(key);
			        	sqlstatementBuilder.append("= ?");
			        }else
			        {
			        	sqlstatementBuilder.append(", ");
			        	sqlstatementBuilder.append(key);
			        	sqlstatementBuilder.append("= ?");
			        }
			        setAreaCount++;
			        if(key.equals(Constant.LastLogInTimeColumn)){
			        	if(value.equals("")||value.equals("null")){
			        		targetValues.add(null);
			        	}else{
			        		targetValues.add(value);
			        	}
			        }else{
			        	targetValues.add(value);
			        }
			        
				}
				if(whereValue==null)return false;
				String wherestatement = " WHERE "+keyId+"=?";
				sqlstatementBuilder.append(wherestatement);

				PreparedStatement ps = conn.prepareStatement(sqlstatementBuilder.toString());
				for(int j=0;j<targetValues.size();j++){
					ps.setObject(j+1, targetValues.get(j));
				}
				ps.setObject(targetValues.size()+1, whereValue);
				
				int itemCount = ps.executeUpdate();
				if(itemCount<=0)return false;
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
		
		return true;
	}
	
	public static Boolean ExecuteMultipleInsert(Connection conn, String tablename,
			JSONArray array, java.sql.Timestamp createTime)
	{
		try {
			for(int i=0;i<array.length();i++)
			{
				JSONObject object = array.getJSONObject(i);
				if(object==null)continue;
				int objectKeyCount=0;
				//String whereStatement="WHERE " +keyId +"= ?";
				String targetContent=null;
				StringBuilder sqlstatementBuilder= new StringBuilder(100);
				sqlstatementBuilder.append("INSERT INTO ");
				sqlstatementBuilder.append(tablename);
				Iterator iterator = object.keys();
				ArrayList<String>  targetProperties=new ArrayList<String> ();
				ArrayList targetValues=new ArrayList();
				while(iterator.hasNext()){

			        String key = (String) iterator.next();
			        Object value = object.get(key);
//			        if(keyId.equals(key)){
//			        	targetContent = (String)value;
//			        	continue;
//			        }
			        targetProperties.add(key);
			        targetValues.add(value);
				}
				if(targetProperties.size()!=targetValues.size()||(targetProperties.size()==0))return false;
				String questionMarkArray="";
				for(int j=0;j<targetProperties.size();j++){
					//INSERT INTO sys_conf_userinfo (UserName,UserTypeID,"
					//+	"Password, RealName, Tel, Address, CreateTime, LastLoginTime) VALUES (?,?,?,?,?,?,?,?)"
					if(j==0){
						sqlstatementBuilder.append(" (");
						sqlstatementBuilder.append(targetProperties.get(j));
						questionMarkArray+="(?";
						continue;
					}
					sqlstatementBuilder.append(", ");
					sqlstatementBuilder.append(targetProperties.get(j));
					questionMarkArray+=",?";
				}
				if(createTime!=null){
					sqlstatementBuilder.append(", CreateTime");
					questionMarkArray+=",?";
				}
				questionMarkArray+=")";
				sqlstatementBuilder.append(") VALUES ");
				sqlstatementBuilder.append(questionMarkArray);
				PreparedStatement ps = conn.prepareStatement(sqlstatementBuilder.toString());
				for(int j=0;j<targetValues.size();j++){
					ps.setObject(j+1, targetValues.get(j));
				}
				if(createTime!=null){
					ps.setObject(targetValues.size()+1, createTime);
				}
				int itemCount = ps.executeUpdate();
				if(itemCount<=0)return false;
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
		
//		ps = conn.prepareStatement(Constant.SQL_UPDATE_USER);
//		
//		ps.setString(1, psd);
//		ps.setString(2, realName);
//		ps.setString(3, tel);
//		ps.setString(4, address);
//		ps.setString(5, userName);
		return true;
	}
	
	public static Boolean ExecuteMultipleInsert(Connection conn, String table,
			JSONArray array){
		return ExecuteMultipleInsert(conn,table,array,null);
	}
	
	
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
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
		return jArray;
	}
	
	public static int getNumber(PreparedStatement ps, Connection conn){
		
		ResultSet rs = null;
		ResultSetMetaData  rsMetaData = null;
		int result=-1;
		int columnCount = 0;
		try {
			rs = ps.executeQuery();
			
			while (rs.next()) {
				rsMetaData = rs.getMetaData();
				columnCount = rsMetaData.getColumnCount();
				if(columnCount==1){
					result = rs.getInt(1);
				}
				
			}
			rs.close();
			ps.close();
		} catch (Exception e) {
			e.printStackTrace();
			return result;
		}
		
		return result;
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
