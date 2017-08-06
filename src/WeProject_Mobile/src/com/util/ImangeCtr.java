package com.util;

import java.util.UUID;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ImangeCtr {
	public static JSONObject formatImageResponse(String imageName, String strDelServlet, String errorMsg) {
		
		JSONObject resultJObject = new JSONObject();
		
		String[] strList = {"<img src='image/"+ imageName +"' class='file-preview-image'>"};
        JSONArray initialPreviewConfigArr = new JSONArray();
        JSONObject ConfigObj = new JSONObject();
        try{
        	ConfigObj.put("caption", "image/"+imageName);
        	ConfigObj.put("width", "120px");
        	ConfigObj.put("url", strDelServlet);
        	ConfigObj.put("ImageName", imageName); 
        	ConfigObj.put("key", imageName); 
        	
	        initialPreviewConfigArr.put(0, ConfigObj);
	        
	        resultJObject.put("error", errorMsg);
	        resultJObject.put("initialPreview", strList);
	        resultJObject.put("initialPreviewConfig", initialPreviewConfigArr);
	        resultJObject.put("initialPreviewThumbTags", "");
        }
        catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return resultJObject;
	}
	
	public static JSONObject getValueFromID(JSONArray list, String ID){
		int length = list.length();
		JSONObject jObject = null;
		for (int i = 0; i < length; i++) {
			String tmpIDString = null;
			try {
				jObject = (JSONObject) list.get(i);
				tmpIDString = jObject.getInt("ID")  +"";
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			if( tmpIDString != null && tmpIDString.equals(ID)){
				return jObject;
			}
		}
		return null;
	}
}
