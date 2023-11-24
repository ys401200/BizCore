package kr.co.bizcore.v1.ctrl;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import kr.co.bizcore.v1.domain.Cont;
import kr.co.bizcore.v1.domain.ContFileData;
import kr.co.bizcore.v1.domain.Inout;
import kr.co.bizcore.v1.domain.Sopp;
import kr.co.bizcore.v1.domain.SoppFileData;
import kr.co.bizcore.v1.msg.Msg;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/cont")
@Slf4j
public class ApiContCtrl extends Ctrl{
    private static final Logger logger = LoggerFactory.getLogger(ApiContCtrl.class);

    @GetMapping("")
    public String contList(HttpServletRequest request) {
        String result = null, data = null, aesKey = null, aesIv = null, userNo = null, compId = null;
        int compNo = 0;
        HttpSession session = null;
        Msg msg = null;
        List<Cont> list = null;
        int i = 0;
        
        session = request.getSession();
        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compNo = (int) session.getAttribute("compNo");
        userNo = (String) session.getAttribute("userNo");
        msg = getMsg((String) session.getAttribute("lang"));
        if (compNo == 0)
        compNo = (int) request.getAttribute("compNo");
            
        if (compNo == 0) {
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.compNoNotVerified + "\"}";
        }else if(aesKey == null || aesIv == null){
            result = "{\"result\":\"failure\",\"msg\":\"" + msg.aesKeyNotFound + "\"}";
        }else{
            Cont cont = new Cont();
            cont.setCompNo(compNo);
            list = contService.getContList(cont);
            if (list != null) {
                data = "[";
                for (i = 0; i < list.size(); i++) {
                    if (i > 0)
                    data += ",";
                    data += list.get(i).toJson();
                }
                data += "]";
            } else {
                data = "[]";
            }
            data = contService.encAes(data, aesKey, aesIv);
            result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";            
        }

        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.GET)
    public String getDetail(HttpServletRequest req, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        Cont cont = null;
        String data = null;
        String aesKey, aesIv = null;

        if (no == null) { // 글 번호 확인 안됨
            result = "{\"result\":\"failure\",\"msg\":\"contNo is not exist\"}";
        } else { // 글 번호 확인 됨
            session = req.getSession();
            compId = (String) session.getAttribute("compId");
            compNo = (int) session.getAttribute("compNo");
            aesKey = (String) session.getAttribute("aesKey");
            aesIv = (String) session.getAttribute("aesIv");
            if (compId == null)
                compId = (String) req.getAttribute("compId");
                userNo = (String) session.getAttribute("userNo");

            if (compId == null) { // 회사코드 확인 안됨
                result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
            } else if (userNo == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Session expired and/or Not logged in.\"}";
            } else { // 회사코드 확인 됨
                cont = contService.getCont(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를 확인함

                if (cont != null) { // 처리됨
                    data = cont.toJson();
                    data = contService.encAes(data, aesKey, aesIv);
                    result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";
                    
                } else { // 처리 안됨
                    result = "{\"result\":\"failure\",\"msg\":\"Error occured when read.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String insert(HttpServletRequest req, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException {

        int compNo = 0;
        HttpSession session = null;
        String result = null;
        String data = null, aesKey = null, aesIv = null;
        ObjectMapper mapper = new ObjectMapper();
        int check = 0;

        session = req.getSession();

        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compNo = (int) session.getAttribute("compNo");
        data = soppService.decAes(requestBody, aesKey, aesIv);
        Cont cont = mapper.readValue(data, Cont.class);
        cont.setCompNo(compNo);
        
        if(cont.getContOrddate().equals("")){
            cont.setContOrddate(null);
        }

        if(cont.getDelivDate().equals("")){
            cont.setDelivDate(null);
        }

        if(cont.getFreemaintSdate().equals("")){
            cont.setFreemaintSdate(null);
        }

        if(cont.getFreemaintEdate().equals("")){
            cont.setFreemaintEdate(null);
        }

        if(cont.getPaymaintSdate().equals("")){
            cont.setPaymaintSdate(null);
        }

        if(cont.getPaymaintEdate().equals("")){
            cont.setPaymaintEdate(null);
        }

        check = contService.insertCont(cont);

        if (check > 0) {
            result = "{\"result\":\"ok\"}";
        } else {
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

        return result;
    }

    @RequestMapping(value = "/{no}", method = RequestMethod.DELETE)
    public String delete(HttpServletRequest req, @PathVariable String no) {

        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        String uri = req.getRequestURI();
        String[] t = null;
        int num = 0;

        // 글 번호 확인
        if (no == null) { // 글 번호 확인 안됨
            result = "{\"result\":\" failure\",\"msg\":\"notiNo is not exist\"}";
        } else { // 글 번호 확인 됨
            session = req.getSession();

            userNo = (String) session.getAttribute("userNo");
            compNo = (int) session.getAttribute("compNo");
            compId = (String) session.getAttribute("compId");
            if (compId == null)
                compId = (String) req.getAttribute("compId");

            if (compId == null) { // 회사코드 확인 안됨
                result = "{\"result\":\" failure\",\"msg\":\"Company ID is not verified.\"}";
            } else if (userNo == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Session expired and/or Not logged in.\"}";
            } else { // 회사코드 확인 됨
                num = contService.delete(compNo, no); // 삭제(update) 카운트를 실제 삭제 여부를 확인함
                if (num > 0) { // 처리됨
                    result = "{\"result\":\"ok\"}";
                } else { // 처리 안됨
                    result = "{\"result\":\" failure\",\"msg\":\"Error occured when delete.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }
    
    @RequestMapping(value = "/{no}", method = RequestMethod.PUT)
    public String update(HttpServletRequest req, @RequestBody String requestBody, @PathVariable String no) throws JsonMappingException, JsonProcessingException {
        String compId = null;
        int compNo = 0;
        String result = null;
        HttpSession session = null;
        String data = null, aesKey = null, aesIv = null;
        ObjectMapper mapper = new ObjectMapper();

        session = req.getSession();
        compNo = (int) session.getAttribute("compNo");
        compId = (String) session.getAttribute("compId");
        if (compId == null) {
            compId = (String) req.getAttribute("compId");
        }

        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        data = contService.decAes(requestBody, aesKey, aesIv);
        Cont cont = mapper.readValue(data, Cont.class);
        cont.setCompNo(compNo);

        if (contService.updateCont(cont) > 0) {
            result = "{\"result\":\"ok\"}";
        }

        return result;
    }

    @RequestMapping(value = "/contInout/{no}", method = RequestMethod.GET)
    public String getContInout(HttpServletRequest req, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        List<Inout> list = null;
        String data = null;
        String aesKey, aesIv = null;
        int i = 0;

        if (no == null) { // 글 번호 확인 안됨
            result = "{\"result\":\"failure\",\"msg\":\"salesNo is not exist\"}";
        } else { // 글 번호 확인 됨
            session = req.getSession();
            compId = (String) session.getAttribute("compId");
            compNo = (int) session.getAttribute("compNo");
            aesKey = (String) session.getAttribute("aesKey");
            aesIv = (String) session.getAttribute("aesIv");
            if (compId == null)
                compId = (String) req.getAttribute("compId");
            userNo = (String) session.getAttribute("userNo");

            if (compId == null) { // 회사코드 확인 안됨
                result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
            } else if (userNo == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Session expired and/or Not logged in.\"}";
            } else { // 회사코드 확인 됨
                Inout inout = new Inout();
                inout.setContNo(Integer.parseInt(no));
                list = contService.getContInoutList(inout);
                
                if (list != null) {
                    data = new Gson().toJson(list).toString();
                } else {
                    data = "[]";
                }

                data = contService.encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}"; 
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "/contFile/{no}", method = RequestMethod.GET)
    public String getContFile(HttpServletRequest req, @PathVariable String no) {
        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        List<ContFileData> list = null;
        String data = null;
        String aesKey, aesIv = null;
        int i = 0;

        if (no == null) { // 글 번호 확인 안됨
            result = "{\"result\":\"failure\",\"msg\":\"salesNo is not exist\"}";
        } else { // 글 번호 확인 됨
            session = req.getSession();
            compId = (String) session.getAttribute("compId");
            compNo = (int) session.getAttribute("compNo");
            aesKey = (String) session.getAttribute("aesKey");
            aesIv = (String) session.getAttribute("aesIv");
            if (compId == null)
                compId = (String) req.getAttribute("compId");
            userNo = (String) session.getAttribute("userNo");

            if (compId == null) { // 회사코드 확인 안됨
                result = "{\"result\":\"failure\",\"msg\":\"Company ID is not verified.\"}";
            } else if (userNo == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Session expired and/or Not logged in.\"}";
            } else { // 회사코드 확인 됨
                ContFileData contFileData = new ContFileData();
                contFileData.setContNo(Integer.parseInt(no));
                list = contService.getContFileList(contFileData);
                if (list != null) {
                    data = "[";
                    for (i = 0; i < list.size(); i++) {
                        if (i > 0)
                        data += ",";
                        data += list.get(i).toJson();
                    }
                    data += "]";
                } else {
                    data = "[]";
                }
                data = contService.encAes(data, aesKey, aesIv);
                result = "{\"result\":\"ok\",\"data\":\"" + data + "\"}";     
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "/contFileInsert", method = RequestMethod.POST)
    public String contFileInsert(MultipartHttpServletRequest fileList) throws IOException{
        MultipartFile file = fileList.getFile("file");
		ContFileData contFileData = new ContFileData();
        int check = 0;
        String result = null;
		contFileData.setFileId(UUID.randomUUID().toString());
		contFileData.setFileName(file.getOriginalFilename());
		contFileData.setFileContent(file.getBytes());
		contFileData.setFileSize(String.valueOf(file.getSize()));
		contFileData.setFileExtention(fileList.getParameter("fileExtention"));
		contFileData.setFileDesc(fileList.getParameter("fileDesc"));
		contFileData.setContNo(Integer.parseInt(fileList.getParameter("contNo")));
		contFileData.setUserNo(Integer.parseInt(fileList.getParameter("userNo")));
        
        check = contService.contFileInsert(contFileData);

        if (check > 0) {
            result = "{\"result\":\"ok\"}";
        } else {
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

        return result;
    }

    @RequestMapping(value = "/downloadFile", method = RequestMethod.POST)
	public ResponseEntity<?> downloadFile(HttpServletRequest request) throws IOException {
        ContFileData newContFileData = new ContFileData();
        String fileId = request.getParameter("fileId");
        String contNo = request.getParameter("contNo");
        newContFileData.setFileId(fileId);
        newContFileData.setContNo(Integer.parseInt(contNo));

		ContFileData contFile = contService.downloadFile(newContFileData);
		String fileName = contFile.getFileName();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		headers.add("Content-Disposition", new String(fileName.getBytes("utf-8"), "ISO-8859-1"));
		ResponseEntity<byte[]> entity = new ResponseEntity<byte[]>(contFile.getFileContent(), headers, HttpStatus.OK);
		
		return entity;
	}

    @RequestMapping(value = "/contFileDelete/{fileId}", method = RequestMethod.DELETE)
    public String contFileDelete(HttpServletRequest req, @PathVariable String fileId) {

        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        String uri = req.getRequestURI();
        String[] t = null;
        int num = 0;

        // 글 번호 확인
        if (fileId == null) { // 글 번호 확인 안됨
            result = "{\"result\":\" failure\",\"msg\":\"notiNo is not exist\"}";
        } else { // 글 번호 확인 됨
            session = req.getSession();

            userNo = (String) session.getAttribute("userNo");
            compNo = (int) session.getAttribute("compNo");
            compId = (String) session.getAttribute("compId");
            if (compId == null)
                compId = (String) req.getAttribute("compId");

            if (compId == null) { // 회사코드 확인 안됨
                result = "{\"result\":\" failure\",\"msg\":\"Company ID is not verified.\"}";
            } else if (userNo == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Session expired and/or Not logged in.\"}";
            } else { // 회사코드 확인 됨
                num = contService.contFileDelete(fileId); // 삭제(update) 카운트를 실제 삭제 여부를 확인함
                if (num > 0) { // 처리됨
                    result = "{\"result\":\"ok\"}";
                } else { // 처리 안됨
                    result = "{\"result\":\" failure\",\"msg\":\"Error occured when delete.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "/contInoutSingleInsert", method = RequestMethod.POST)
    public String contInoutSingleInsert(HttpServletRequest req, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException {

        int compNo = 0;
        HttpSession session = null;
        String result = null;
        String data = null, aesKey = null, aesIv = null;
        ObjectMapper mapper = new ObjectMapper();
        int check = 0;

        session = req.getSession();

        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compNo = (int) session.getAttribute("compNo");
        data = contService.decAes(requestBody, aesKey, aesIv);
        Inout inout = mapper.readValue(data, Inout.class);
        check = contService.contInoutSingleInsert(inout);

        if (check > 0) {
            result = "{\"result\":\"ok\"}";
        } else {
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

        return result;
    }

    @RequestMapping(value = "/contInoutCheckDelete/{soppdataNo}", method = RequestMethod.DELETE)
    public String contInoutCheckDelete(HttpServletRequest req, @PathVariable String soppdataNo) {

        HttpSession session = null;
        String compId = null;
        int compNo = 0;
        String result = null;
        String userNo = null;
        String uri = req.getRequestURI();
        String[] t = null;
        int num = 0;

        // 글 번호 확인
        if (soppdataNo == null) { // 글 번호 확인 안됨
            result = "{\"result\":\" failure\",\"msg\":\"soppdataNo is not exist\"}";
        } else { // 글 번호 확인 됨
            session = req.getSession();

            userNo = (String) session.getAttribute("userNo");
            compNo = (int) session.getAttribute("compNo");
            compId = (String) session.getAttribute("compId");
            if (compId == null)
                compId = (String) req.getAttribute("compId");

            if (compId == null) { // 회사코드 확인 안됨
                result = "{\"result\":\" failure\",\"msg\":\"Company ID is not verified.\"}";
            } else if (userNo == null) {
                result = "{\"result\":\"failure\",\"msg\":\"Session expired and/or Not logged in.\"}";
            } else { // 회사코드 확인 됨
                num = contService.contInoutCheckDelete(soppdataNo); // 삭제(update) 카운트를 실제 삭제 여부를 확인함
                if (num > 0) { // 처리됨
                    result = "{\"result\":\"ok\"}";
                } else { // 처리 안됨
                    result = "{\"result\":\" failure\",\"msg\":\"Error occured when delete.\"}";
                } // End of if : 3
            } // End of if : 2
        } // End of if : 1
        return result;
    }

    @RequestMapping(value = "/contInoutDivisionInsert", method = RequestMethod.POST)
    public String contInoutDivisionInsert(HttpServletRequest req, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException {

        int compNo = 0;
        HttpSession session = null;
        String result = null;
        String data = null, aesKey = null, aesIv = null;
        ObjectMapper mapper = new ObjectMapper();
        int check = 0;

        session = req.getSession();

        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        compNo = (int) session.getAttribute("compNo");
        data = contService.decAes(requestBody, aesKey, aesIv);
        Inout inout = mapper.readValue(data, Inout.class);
        check = contService.contInoutDivisionInsert(inout);

        if (check > 0) {
            result = "{\"result\":\"ok\"}";
        } else {
            result = "{\"result\":\"failure\" ,\"msg\":\"Error occured when write.\"}";
        }

        return result;
    }

    @RequestMapping(value = "/contInoutUpdate", method = RequestMethod.PUT)
    public String contInoutUpdate(HttpServletRequest req, @RequestBody String requestBody) throws JsonMappingException, JsonProcessingException {
        String compId = null;
        int compNo = 0;
        String result = null;
        HttpSession session = null;
        String data = null, aesKey = null, aesIv = null;
        ObjectMapper mapper = new ObjectMapper();

        session = req.getSession();
        compNo = (int) session.getAttribute("compNo");
        compId = (String) session.getAttribute("compId");
        if (compId == null) {
            compId = (String) req.getAttribute("compId");
        }

        aesKey = (String) session.getAttribute("aesKey");
        aesIv = (String) session.getAttribute("aesIv");
        data = contService.decAes(requestBody, aesKey, aesIv);
        Inout inout = mapper.readValue(data, Inout.class);

        if (contService.contInoutUpdate(inout) > 0) {
            result = "{\"result\":\"ok\"}";
        }

        return result;
    }
}
