package kr.co.bizcore.v1.svc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AttachedService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(AttachedService.class);

    // 첨부파일의 요청에 대한 응담을 처리하는 메서드
    public byte[] getAttachedFileData(String compId, String funcName, int funcNo, String fileName){
        byte[] result = null;
        String sql = "";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        FileInputStream fis = null;
        String rootPath = null, path = null, savedName = null, s = File.separator;
        File file = null;

        rootPath = fileStoragePath + s + compId;
        savedName = systemMapper.getAttachedFileName(compId, funcName, funcNo, fileName);
        logger.info("+++++++++++++++++++++ 파일 다운로드 : savedName : " + savedName);
        if(savedName == null)   return result;

        path = rootPath + s + funcName + s + funcNo + s + savedName;
        file = new File(path);
        logger.info("+++++++++++++++++++++ 파일 다운로드 : exist ? " + file.exists());
        if(!file.exists())  return result;
            try {
                fis = new FileInputStream(file);
                result = fis.readAllBytes();
                fis.close();
            } catch (Exception e) {e.printStackTrace();}

        return result;
    }

    public byte[] getUserImage(String compId, String userNo){
        byte[] result = null;
        FileInputStream fis = null;
        String path = null, savedName = null, s = File.separator;
        Integer g = null;
        int i = 0;
        File file = null;

        path = fileStoragePath + s + compId + s + "userPicture" + s + userNo;
        file = new File(path);
        if(file.exists()){
            try {
                fis = new FileInputStream(file);
                result = fis.readAllBytes();
                fis.close();
            } catch (Exception e) {e.printStackTrace();}
        }else{
            g = systemMapper.getEmployeeGender(compId, userNo);
            i = g == null ? 0 : g;
            result = hexToByteArray(defaultAvatar[i]);
        }

        return result;
    }

    // 업로드된 파일을 저장하는 메서드. 동일 파일명이 존재하는 경우 기 존재 파일을 삭제처리 후 저장하도록 함
    public boolean saveAttachedFile(String compId, String fileName, String savedName, byte[] fileData, String funcName, int funcNo) {
        boolean result = false;
        FileOutputStream fos = null;
        String path = null, s = File.separator, existName = null;
        File file = null;
        int v = 0;

        existName = systemMapper.getAttachedFileName(compId, funcName, funcNo, fileName);
        if(existName != null){
            path = fileStoragePath + s + compId + s + funcName + s + funcNo + s + existName;
            file = new File(path);
            if(file.exists())   file.delete();
            systemMapper.deleteAttachedFile(compId, funcName, funcNo, fileName);
        }

        try{
            path = fileStoragePath + s + compId + s + funcName + s + funcNo;
            file = new File(path);
            if(!file.exists())  file.mkdirs();
            file = new File(path + s + savedName);
            fos = new FileOutputStream(file);
            v = systemMapper.setAttachedFileData(compId, funcName, funcNo, fileName, savedName, fileData.length);
            if(v > 0){
                fos.write(fileData);
                fos.close();
                result = v > 0;
            }
        }catch(IOException e){e.printStackTrace();}

        return result;
    }

    // 업로드된 파일을 임시 저장하는 메서드. 전자결재와 자료실 등 본문이 저장되기 전 파일이 먼저 업로드되는 경우 사용
    public String saveAttachedToTemp(String compId, byte[] fileData) {
        FileOutputStream fos = null;
        String path = null, s = File.separator, savedName = null;
        File file = null;
        int v = 0;

        while(true){
            savedName = createRandomFileName();
            path = fileStoragePath + s + compId + s + "temp" + s + savedName;
            file = new File(path);
            if(!file.exists())  break;
        }

        try{
            fos = new FileOutputStream(file);
            fos.write(fileData);
            fos.close();
        }catch(IOException e){e.printStackTrace();}

        return savedName;
    }

    // 개인정보 수정에서 업로드된 파일을 임시 저장하는 메서드. 이름은 확장자 없이 사번으로 저장.
    public boolean saveMyImageToTemp(String compId, String userNo, byte[] imageData) {
        FileOutputStream fos = null;
        String path = null, s = File.separator;
        File file = null;
        int v = 0;

        path = fileStoragePath + s + compId + s + "temp" + s + userNo;
        file = new File(path);
        if(!file.exists())  file.delete();

        try{
            fos = new FileOutputStream(file);
            fos.write(imageData);
            fos.close();
        }catch(IOException e){e.printStackTrace();return false;}

        return true;
    }

    public String getAttachedFileList(String compId, String funcName, int funcNo) {
        String result = "[";
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0;

        list = systemMapper.getAttachedFileList(compId, funcName, funcNo);
        for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(x > 0)   result += ",";
            result += ("{\"fileName\":\"" + each.get("fileName") + "\",");
            result += ("\"size\":" + each.get("size") + ",");
            result += ("\"removed\":" + !each.get("removed").equals("0") + "}");
        }
        result += "]";

        return result;
    }





    // =================== 기본 아바타 바이너리 데이터 =============================

    // 사용자 이미지가 없을 경우 보여질 이미지의 hex 데이터
    private String[] defaultAvatar = {
        "89504e470d0a1a0a0000000d4948445200000051000000510806000000aa8f4a36000000097048597300000b1200000b1201d2dd7efc0000087249444154789ced9d6b6c145514c70fa5024d3b7d819a160844219a20b011d3188c9942344a44281f044d095489097e2016d2fa4d9e1f4ca4c1257ed04413b724c5a2262ea8418cd81d4d4c2ca5eea654dda5c2aea52f58da6eb76597d28739e39d3abb3bbb3baf7b67bbfa4b36d0f6ce9d3bff39e7cc9d7bcfbd3b677a7a1a320141082f0700f927152efc1bcf73ae4c68bb25220a42b818002ac9c7867a18a8ce03006e22ac8be739bf894d55053311897055e4b395e2a90200e0040007cf736e8ae79981ba888210464bab0580dd544fa40c5aa91d45e5796e98d649a88928086174d5c3065dd52c42444c3b0d314d1791589e3d43c48b07c53cccf39cddcc4a4d1391c43cb4bc374da9902ee8e6b5663ddd4d1191b8ae03009651bd74f339c9f35cadd15a0d8b280861b4be43d42e933e68955546ba46ba4524ee8b5d894c8c7d5a09112175b9778e9e838880ae2c1110290280164108d7e83958b388e4e98ba6bf56cf09339c4ff408a9494422a08bdcb96c45b390aa632271617f960b28e7559ee71c6a0aaab244590cfcaf0808c422abd41454ebce8e2c8d81e97090109692b4ee6c653f7068300c8383e1999fcb172f82bcbc79ac9b81fdc8ca54efdc29452477e1575aad530285fbee7c1b5ce9f04334329e50a2a49483875794c1d3956ba07cf14256cd6ae4792ee9c3269d886e566e2c89d7d6ea537dccaad5cb6147f50656d6b98de739a7d21f928ac8ca8d51bce6a616b8d6d5a7ebf80579f3e08d7d5b5858250ef6da94dc5af1c142e63ba80bd8f68b174ebcfb856e011174f90fde3f27de0cca2c2383cb09247b3a1fa6dda23fbb7ae1cc699762dcd30ad681d6cc8043c4c06248109114a23a941f898cc399267327ead09af1c63020c1c0942c91ba15a21bd3703f7c30316077bc35c688c8c20a91b6562f957ad11a2326840715c4c4c6784b343ccaab86de9edb09a55eae7e1c2efeb40f5e787195a1ba19b9744c9f315e4455ef8a4650bac883479f8703f51b81e3e6c3a1639be0f5bdeba1a060beaeb3f4de08d2be04a4483ed233232279d9663e4782026edef258ccef50c4a6cf7689ff9695156aaa4fc9ca29316370b9b2faa95b613ce8baf1024a9495178922e2a7af370497dbbaa1af7704c2e128f8feb835530eadd7e7bd097d7d23e2cf91c85d56cddf8aa35bd8f9968b58c9eaec085ad881b736aa2b5b5e049bb7a41e85fbe8c39fc50f635033a72822196860eaca078f6d12adc82cd0623b3b06209f2b667919e8bd4e292632b3c2d2520ed6ac5d02eb9e586a7addcf3cb752ac9f21e258a3380021086107cb84a382fc612a2262ecf45dd53581698412e98ce9922a4d8586804062a705d8241199ce1f8f8e4e5971b1b4b0e5904928a64c4cd049e71b1e9eb442c4e21c2938b22414a273b16363968868631e859160f01e957aadb444e6ee8c31d1ecb8188d4e413038616a9d6ab1c49d919e1e7387ac02012643608a58e2ce487fff3dd3dc0fad1aebb30acb4444bcdea8294f6aaf37624a7bf4924316d25802c6b1ce4e6302e08db0badf8922525bdfa1067469bd1689c759e9c61296bab3040ae1f1dc81f171f54262f94c1010ed2087e41c5a0ebaa4cf1755df726bfa844ab873ac5850988cc9c9cc58f1aa9161c99d3db3a6c999875b12d1b2277416f0bf880609e04495246246ac609f8588bacde4270a4278987662bb943e9c979703eb9f5a06b9b900f9f9732137770e141468ef6d61df129feaf8efd8d8148c84a2d0dede2f3ea018a5268b2b0ce453a64e33e65924a17ebb1218181b8d4e04ae0f4c8c8e450aa391f112793961dd52386eaf028e9babfb5c287e71f13fc707fcdd505feb84d1d1d879e7c2a2fc81050bee9b58f9c89289b2f2850f2cbabf30cf4481c5cc59b925e2f4df977a6b43f11c1f5f08f6f6dc5ea4f6184c15c1b4117ec30abda715d133e75cf1e4a3c1975ee155b75581b33ccf89090f31e9c67a5d1a33b1de397a3a14b973575738c06426ccc5d10aceeed5d53ae1aaef96e66391d56b1f1adcf5dab3a5ba0e962d168a0f44aa5610c573a6a96540af804873533b546f6f1445518bd0d205d5db4fe91610e9f05c2bedf05cbba3e3d090e4caa020a2e665fde8c69d1dfe0775342406140345f9fadc9594e5c2e1bb70e2f80f50bf3f31fee9e1f3e61ff5bc803be409f031229257c0b35a6afbfe42bb69b96c28cad183dfc291b7cf8b62c583894b7bf7348b966b16e8413a721a638c4da95fa1c91a2f5ff2e59b7645846fbeea849ddb1b45d1243e6dba0c7bf79c31e4bec9705df4746b28de183fde901b5f02579f0b42f8ac9a0d8030177072722acf40fb9382a9723b779c82fdf51ba0fd523708ae2e1aa711f15fef2fd0503c21a73d414442ad1a11bdbf770f612e8a860668e6bde3f49756601f16637b49fa64a8934aa35e8aaf09a4e09174357676f84735b435a3e9499f611b4ab6b222d5bb969d2cc54acad0d028f3259fb4e8f2f5a4bc564c764fb6d234a988e48094cbf847426386bb3699c255ef8d64a10dc8db89e2e2484837c742b63851746b8609e64c989a9c4e963e1148674c69874e789ec33820c4ff9e6182391382c19052bab5b45f4eca1951b5e34f55f15308c15b23d6ce98b3a156cd1e8caa442477a28adc1991bededb37531f35fb880b51e6ee4602ff767b2ae542661bb210d5a856404d221221ddd92e24e9506bda5c48f398bc24e45ffe81ac73e7febec1037ab602d4bd6b5d85ad41da70281bf6cb41cfaa6975d725ed0ba6c2f0fe8915b606fb2cd9bd33191e22a0ee6963c3094dadee3a34ff6db3344e9ec4d064444030734f59e2de768bb682d64a80585fe6ec292ba7c2d690495b43c7236e15ddeaae33759f0b6afb6c57d81a6a889899b059efcc3edbadeebaccdf673b1e6299aa0679291020e239688827c1ecbb072a6c0dcbc9ab630de56e91349de9302be6a5c3926fc12082cabf05c388a821d9b760388d3e69f59031dfc742dc1e9ff0d2e224f9ff117c7797e637d035512c7fabbbceda4c5f00f81b4a28b132605b67df0000000049454e44ae426082",
        "89504e470d0a1a0a0000000d4948445200000051000000510806000000aa8f4a36000000097048597300000b1200000b1201d2dd7efc0000089349444154789ce59d6d68144718c71faf621a9a4d62d542226aa4d60ab56dda48682d65632945414c28341a22342205fba13496d80f856ab4d02f063ce9874a5b6922049552882f6db548932d583555b9d4979a18c34593bbd65cbc9c9b72466aae3ceb6cdceceddecdeceecc5dd23f1cb9e4765ef69767e6997966766e462291806c90a2a88500504aaa823f0b2daad5417e0665590a6645c50120231009b02a020b5fb2c3acba002040e076640aac30888aa29610707500f022a762fa01a00d009a65590a702a2349dc212a8a8ad0ea3982b31302f513a0233c0be2029134d77af22af0bc0036c5084c3f2f989e43541415c13566013cb3b8c1f40ca2a2a815a492a29b2dab10669d2c4b6d5e65e81a2269ba68791f7a5529413a4260bab64a57101545c5e149f314b03e3ba15556c9b2d4e12cf943f99c26245e170b9faa0081f4dbeda41f772c4796480adde3f51d65582db22cd539a90233444551b1f9be9bfd4c1cc911482688d31ca02e4596a50a9604d47da2a2a8feff0140944c8c855a5496489cc8b7bc6b9f65a26eda6921924174fbf46344a54db22ca5b5ca9410c9403a9889295c3c7e1f428311ed7d6e6e0e14cf9f23ba0aba5e4a17114a07b1c345ac8f59e7cf75c3e54b41b8d11b827bf1fb49c911e4d34b8ae1f58ae761f69392a86a6134a834d5ccc616a2c8b120c2fbf9c40588de51a9d3ac285f0aebde7e0d72736771ad1bd15e59966c07e49610490035c0bb1963936dfee604f4f5861da57f3c7716bcffc13a514d7d95ddf4d06e88e3e70d3034380c9fef6c750c10854dfecb2f8e6a790990ad83498248bc7125cf3a3db4c09396fd1eab74902c5d81432d2243bd2459596223efda1c6e6df7f4a611e4a15621a3304b369320122be4ea8dd1f35eb9e4fda21c760b029ab5a5359a2dd155488846adcda71ca77d66e9bc949f7f7ff857ef2b9cac246b9c80483c32d7be30d8f717a86adc51daedbb56c3befd1b202f2fc7f69a815b432e6a472db4c62ae3c5464b74144b63d1efe7ba99d3203404b876dd7290a41cd8edafb2bd767c3ca10dd60568122ba110aff70c305dff72d902d8b77fbd065057d98a05b075db2adb347dd7436eab49a34a3225d634131ead952ce25d72f4ce28d575d8f7d56c2c9b04cfa89ada32e8b9761b7e387625e9b34132df16a02a7dec38939465df463c523acf89cd565eb54483b7f4d9a7d216bae3b335da4f3348378377462541648ae43ad10d8b6686e0d6563ea7591c0d38b3ec40e23f4cc0547082990e917ba4c63cb87e6fcb4ad8505ba6390b374290527e0e1c6abd0879520e8caa63101a8888805880dd2086c97c6480cd5dc6be0abd2d42740b50d747dbde80dd7baa60ce9c27b4bfdce13f05d4a5b1f31936567295de57bdba72b1adc37023ec4fdf5abd4ccb0167458254a2432ce15d5edc106858fe4211f7dbf322b04129cd00855862c8d094c3a1bbdccad1f316141a032344ee8a0e3feaa37aba6f732bce98b780d018e831579f08cf6cece8f146c361efad11f3344214e55c70e622c412cdcd4bf9a5d7f332cc791aad9fb34a85408cc7c726fd7eb0f582e76598f31438cc11d4279ae6cce1504c1b1c7b25cc0bf3344aa087160531d92abede77da93be11f3c0bccc1218881003d14aaa3a06dbeadb6074748c3d3111a6c53c30af4c8a3bc454b307f4a65b361f760412d3605abb2193c0684ed047b649644c08a1b6fa005cbc708bba0a782da6e139e6a4153e0ae7231b96322a740a68557b76a75ff63c7ef48a76add99158292ec8b97087681547b4138d65d1c0d315e2ef5c141001719a6b4487e8ea198e6c9680e6aced5bf4e96f78496044254918e1e62ccd007d64f322370f6d9ef24d27e95bedf435963691cfe661187f45f94258b8683614cf2f80a2e27c282a2e80a2a2fcb4697159015704d109e1201b974e6ff647e17ce74d181efe4748fd8914fd8d0eb1c36b8838c88e0cdd8d0fdd8ecdc0fd98c6cff066fb6e44e0e34fde74b4ce82ab84b8b00f64817fcbe6439600cffef6e7bd82c2bcc4dc79f9b9b84dd9634d3ca53ab1535651d4112f36767e775089749ebd36971606ee7070b25c0a0e663ce5af2c8bbc532353d58d428bf533278cd33ed7cffffe78ec5c8c162090a9dbc6f507e0f8d1cbcc65611a4ccb3265c4ba611d990b4b5697f1d00e2344a6a788ccc2484dfba980234bdeb5fd04ecfcf427eaebf15a4ce34458470f960efcc65f2620124fd3e534d753272fba1a4fe02e86daea96941119fc0cafb1da83c3a233a7afbab1c698b9d59aa3387e70a83fbafa1e737567daaeb121d858dd6239fdc3bf55aef94abbc6adce9cbe3aee228ba433242641248f60318f19b179dc8bdf9fedfaee4890159d85b19fc4f74e436656c2baba68d249ddde4c8b8b1a591f86ece91ec4edafb94e6b6516c2c23e4fb7482f9712740d0e0e3b792a6ba7d52950494159628d4c7d633834cc25b087f0780044f5f60cb2b6b8985d776717d966da007fbd7bc0caa2b35a0eeadc68f77c9f2544e2a9f7d2e63efe20f1ef5481a78bb1cef834beadd34db5c6d248eb64229118f7adca5e2b1a5569a749b174fbd96d2112d3e5be0d39537af0609cd611d6a73b5230e56a1f79587a6bb603e1a8169a27efd32e9992bea0c5ee7341bbafb8284de4bb8bd6c152ad3b9303252c873d22f7bc78ad140b5978af15b4e788b12cde57b8995b4f21e9e787511fc4460d91643add41c6880532ad80326d2331803cc25cbdec171a478993b36899f7e220485996aa52399b292885a50f740dd100139dcda6f1f184d0d5210ec2a0826380e07657188ea1fe0e47aba7683f191b898ed6c8b2e4fab806cfce942d2f6dc2caecf02433fec2aea8be33d0e0c901bd9e9e6e5c5eda54428296c24e756214f67d8d9d81064fb7ce703967bbbcb4a9820430b205663f81e76a31ce4e5c4f7c2730eb3278ee225a9ebf33d0e0d971d05612f2dd03e5a54d850426cfef1dd0d54fba94e6ce4083906d83c2bf0583f49b158697db58644cff160c5cca1405cea88c7f1f0bb152fd2b45f03d42b67bf215bda93ea34068c14c409b2400f80faec0dd30a27b844e0000000049454e44ae426082"
    };
    
}
