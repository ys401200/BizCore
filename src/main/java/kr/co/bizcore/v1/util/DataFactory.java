package kr.co.bizcore.v1.util;

import java.util.HashMap;

public class DataFactory {

    private String compId;
    private static HashMap<String, DataFactory> root = new HashMap<>();
    private HashMap<String, Object> factory;

    private DataFactory(String compId) {
        this.compId = compId;
        factory = new HashMap<>();
    }

    // compId를 입력받아 해당 factory를 반환하는 메서드
    public static DataFactory getFactory(String compId) {
        DataFactory result = null;

        result = root.get(compId);
        if (result == null) {
            result = new DataFactory(compId);
            root.put(compId, result);
        }

        return result;
    } // End of getFactory()

    public Object getDataSet(String key) {
        return factory.get(key);
    } // End of getData

    public void setDataSet(String key, Object data) {
        factory.put(key, data);
    } // End of getData

}
