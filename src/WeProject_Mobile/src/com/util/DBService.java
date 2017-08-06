package com.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import com.database.DBController;

public class DBService {

	public static final boolean UpdateStatisticalInfo(String date){
		
		String[] cuntString = date.split("-");
		String dayString = cuntString[2];
		String monthString = cuntString[1];
		String yearString = cuntString[0];
		
		PreparedStatement ps = null;
		Statement statement = null;
		Connection conn = DBController.getConnection();
		
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		GregorianCalendar gc = new GregorianCalendar(Integer.parseInt(yearString), Integer.parseInt(monthString)-1, Integer.parseInt(dayString));
		
		
		//Update sta_daybytype
		//
		//DELETE FROM sta_daybytype WHERE DAY='2015-07-06';
		//INSERT into sta_daybytype(Day,TypeID,value) 
		//select * from ((SELECT t1.Date,t1.TypeID as type,SUM(t1.Value) as value FROM data_detailconsume t1 GROUP BY t1.TypeID ORDER BY t1.TypeID) t2) 
		String updateSta_DayString = "DELETE FROM sta_daybytype WHERE DAY='" + date + "';\n";
		
		try {
			ps = conn.prepareStatement(updateSta_DayString);
			ps.executeUpdate();
			updateSta_DayString = "INSERT sta_daybytype (Day,TypeID,value) \n\n"; 
			updateSta_DayString += "SELECT Date,Type,value from\n ( SELECT\n t1.Date,\nt1.TypeID as Type,SUM(t1.Value) as value FROM data_detailconsume t1\n";
			updateSta_DayString += " where t1.Date = '"+ date +"' GROUP BY t1.TypeID ORDER BY t1.TypeID ) as t2; \n"; 
			ps = conn.prepareStatement(updateSta_DayString);
			ps.executeUpdate();
		} catch (SQLException e2) {
			e2.printStackTrace();
		}
		
		//Update sta_monthbytype
		//
		//DELETE FROM sta_monthbytype WHERE Month='2015-07-01';
		//INSERT INTO sta_monthbytype(MONTH,TypeID,value) SELECT * FROM
		//((SELECT '2015-07-01',TypeID,sum(value) as value from sta_daybytype WHERE day >= '2015-07-01' and day < '2015-08-01' GROUP BY TypeID) t2)
		gc.set(Calendar.DAY_OF_MONTH, 1);
		Date dateMonth = gc.getTime();
		monthString = dateFormat.format(dateMonth);
		
		String updateSta_MonthString = "DELETE FROM sta_monthbytype WHERE Month = '" + monthString+ "';\n";
		try {
			ps = conn.prepareStatement(updateSta_MonthString);
			ps.executeUpdate();
			updateSta_MonthString = "INSERT sta_monthbytype (MONTH,TypeID,value) SELECT * FROM \n"; 
			updateSta_MonthString += "( SELECT '" + monthString+ "',TypeID,sum(value) as value from sta_daybytype WHERE day >= '" + monthString + "' and ";
			gc.add(Calendar.MONTH, 1);
			dateMonth = gc.getTime();
			monthString = dateFormat.format(dateMonth);
			updateSta_MonthString += "day < '" + monthString + "' GROUP BY TypeID ) as t2;";
			ps = conn.prepareStatement(updateSta_MonthString);
			ps.executeUpdate();
		} catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		
		//Update sta_yearbytype
		//
		//DELETE FROM sta_yearbytype WHERE Year='2015-07-01';
		//INSERT INTO sta_yearbytype(YEAR,TypeID,value) SELECT * FROM
		//((SELECT '2015-01-01',TypeID,sum(value) as value from sta_monthbytype WHERE MONTH >= '2015-00-01' and MONTH < '2016-01-01' GROUP BY TypeID) t2)
		gc.add(Calendar.MONTH, -1);
		gc.set(Calendar.MONTH, 0);
		dateMonth = gc.getTime();
		yearString = dateFormat.format(dateMonth);
		
		String updateSta_YearString = "DELETE FROM sta_yearbytype WHERE Year='"+yearString+"';\n";
		try {
			ps = conn.prepareStatement(updateSta_YearString);
			ps.executeUpdate();
			updateSta_YearString = "INSERT sta_yearbytype (YEAR,TypeID,value) SELECT * FROM\n";
			updateSta_YearString += "( SELECT '"+yearString+"',TypeID,sum(value) as value from sta_monthbytype WHERE MONTH >= '"+yearString+"' \n";
			gc.add(Calendar.YEAR, 1);
			dateMonth = gc.getTime();
			yearString = dateFormat.format(dateMonth);
			updateSta_YearString += "and MONTH < '"+yearString+"' GROUP BY TypeID ) as t2;";
			ps = conn.prepareStatement(updateSta_YearString);
			ps.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		try {
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return true;
	}

}
