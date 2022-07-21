package kr.co.bizcore.v1.util;

import java.io.File;

public class UploadedFileStorage {

    private String PATH;

    public UploadedFileStorage(String path){PATH = path;}

    public File getFileStorage(String compId){
        File result = null, root = null;
        File[] children = null;

        if(PATH == null)    return result;

        root = new File(PATH);
        if(root.exists() && root.isDirectory()){
           children = root.listFiles();
            for(File child : children){
                if(child.isDirectory() && child.getName().equals(compId)){
                    result = child;
                    break;
                }
            }
        }
        return result;
    } // End of saveAttachedFile()

    public String getFileStoragePath(String compId){
        String result = PATH;
        if (!result.substring(result.length() - 1).equals("/"))  result = result + "/";
        result += compId;
        return result;
    }
    
}
