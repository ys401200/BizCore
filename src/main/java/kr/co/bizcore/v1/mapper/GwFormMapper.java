package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.DocForm;

public interface GwFormMapper {
    
    @Select("SELECT no, id, width, height, title, `desc`, form, defaultJson, in_use, created, modified, deleted, remark FROM bizcore.doc_form WHERE inuse = 1")
    public List<DocForm> getFormList();

    @Select("SELECT no, id, width, height, title, `desc`, form, defaultJson, in_use, created, modified, deleted, remark FROM bizcore.doc_form WHERE id = #{docId} AND in_use = 1")
    public DocForm getForm(@Param("docId") String docId);

    @Insert("")
    public int addForm();
}
