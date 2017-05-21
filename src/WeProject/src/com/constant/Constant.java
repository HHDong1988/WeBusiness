package com.constant;

//import org.hibernate.sql.Update;

public final class Constant {
	public static final String SQL_SELECT_USER = "SELECT * FROM sys_conf_userinfo "
			+ " WHERE UserName = ? AND Password = ? ";
	
	public static final String LOGIN_ERROR = "User name or password is wrong.";
	public static final String COMMON_ERROR = "Don't have the right permissions!";
	public static final String ERROR_WRONGPARAM = "Parameter wrong!";
	
	// public 
	public static final String SQL_SELECT_USER_LIST = "SELECT ID, UserName FROM data_user";
	
	// Account function
	public static final String SQL_SELECT_CONDUMETYPE = "SELECT ID,Name_EN,Name_ZH,IsOut FROM enum_consumetype ORDER BY ID";
	public static final String SQL_SELECT_LOGDATA = "SELECT * from data_detailconsume WHERE Date = ? ";	
	public static final String SQL_SELECT_MONTHDETAIL = "SELECT * from data_detailconsume WHERE Date = ?";
	public static final String SQL_SELECT_ALLYEARS = "SELECT DISTINCT year FROM sta_yearbytype ";
	
	
	// Clothes function
	public static final String SQL_SELECT_SEASON = "SELECT * FROM enum_season";
	public static final String SQL_SELECT_COLOR = "SELECT * FROM enum_color";
	public static final String SQL_SELECT_MAINTYPE = "SELECT * FROM enum_clothestype";
	public static final String SQL_SELECT_SUBTYPE = "SELECT * FROM enum_clothessubtype";
	public static final String SQL_SELECT_SINGLEITEM = "SELECT ID,BuyTime,TypeID,Description,SubTypeID,ColorID,UserID,Link1,Link2,Link3,Value,SeasonID,`Where` FROM data_clothesdetail where ID = ?";
	
	// Medicine function
	public static final String SQL_SELECT_MEDICINETYPE = "SELECT * FROM enum_medicinetype";
	public static final String SQL_SELECT_MEDSINGLEITEM = "SELECT ID,`Name`,Production_Date,Expiration_Date,TypeID,Amount,`Left`,Unit,`Value`,`Usage`,Note,Link,Location_Buy as Location FROM data_medicnedetail where ID = ?";
	public static final String SQL_SELECT_MEDUPDATE = "Update data_medicnedetail set `left`=? where ID = ?";
	
	// Blogs function
	public static final String SQL_SELECT_BLOGLIST = "SELECT ID,UserID,Title,Date FROM data_blogs";
	public static final String SQL_SELECT_BLOGITEM = "SELECT * FROM data_blogs where ID= ?";
	
	// Gift function
	public static final String SQL_SELECT_GIFTLIST = "SELECT ID,Name,Value,IsIn,Date,Description FROM date_giftdetail";
	
	// AC function
	public static final String SQL_SELECT_ACLIST = "SELECT ID,Host,Account,Password,Combine,Answer FROM data_AClist";
	
	// schedule function
	public static final String SQL_SELECT_SCHEDULELIST = "SELECT Date,StartTime,EndTime,Title,`Where`,UserID,Description FROM data_schedule";	
//	select 
//	DAY as Date,
//max(case ID when 1 then VALUE else 0 end) '1',
//max(case ID when 2 then VALUE else 0 end) '2',
//max(case ID when 3 then VALUE else 0 end) '3',
//	max(case ID when 4 then VALUE else 0 end) '4'
//from 
//sta_daybytype 
//group by Date
	
	
//Update sta_daybytype
//
//DELETE FROM sta_daybytype WHERE DAY='2015-07-06';
//INSERT into sta_daybytype(Day,TypeID,value) 
//select * from ((SELECT t1.Date,t1.TypeID as type,SUM(t1.Value) as value FROM data_detailconsume t1 GROUP BY t1.TypeID ORDER BY t1.TypeID) t2) 

//Update sta_monthbytype
//
//DELETE FROM sta_monthbytype WHERE Month='2015-07-01';
//INSERT INTO sta_monthbytype(MONTH,TypeID,value) SELECT * FROM
//((SELECT '2015-07-01',TypeID,sum(value) as value from sta_daybytype WHERE day >= '2015-07-01' and day < '2015-08-01' GROUP BY TypeID) t2)

//Update sta_yearbytype
//
//DELETE FROM sta_yearbytype WHERE Year='2015-07-01';
//INSERT INTO sta_yearbytype(YEAR,TypeID,value) SELECT * FROM
//((SELECT '2015-01-01',TypeID,sum(value) as value from sta_monthbytype WHERE MONTH >= '2015-00-01' and MONTH < '2016-01-01' GROUP BY TypeID) t2)


}
