// Temp file, functionality will be moved to blobstore.js !!!

/**
 * http://code.google.com/appengine/docs/java/blobstore/
 * http://code.google.com/appengine/docs/python/blobstore/
 */

var JBlobstoreServiceFactory = Packages.com.google.appengine.api.blobstore.BlobstoreServiceFactory;   
var jservice = exports.BlobstoreService = JBlobstoreServiceFactory.getBlobstoreService();

var JBlobKey = exports.BlobKey = Packages.com.google.appengine.api.blobstore.BlobKey;
/*
var JBlobInfo = exports.BlobInfo = Packages.com.google.appengine.api.blobstore.BlobInfo;
exports.BlobInfoFactory = Packages.com.google.appengine.api.blobstore.BlobInfoFactory; 
*/

exports.createUploadUrl = function(dest) {
    return String(jservice.createUploadUrl(dest));
};
  
exports['delete'] = function(key) {
    //TODO: accept BlobKey object as argument instead of plain text key ???
    jservice['delete'](new JBlobKey(key));
};   

exports.getUploadedBlobs  = function(env) {
    var map = jservice.getUploadedBlobs(env["jack.servlet_request"]);
    var result = {};
    for (var i in Iterator(map.entrySet())){
       result[i.getKey()] = (new String(i.getValue())).split(" ")[1].split(">")[0];  // TODO: better parsing
    }  
    //TODO: return BlobKey objects instead of plain text keys ???
    return result;
};

exports.serve  = function(env, key) { 
    jservice.serve(new JBlobKey(key), env["jack.servlet_response"]); 
};
 
/*     
var BlobKey = exports.BlobKey = function(keyString) {
    this.__key__ = new JBlobKey(keyString);
}
*/

/*
Upload form
   
   <form action="{uploadUrl}" method="post" enctype="multipart/form-data">
       <input type="file" name="myFile">
       <input type="submit" value="Submit">
   </form>
   
Upload 

    exports.POST = function(env) {
        var blobinfo = blobs.getUploadedBlobs(env); 
        return {
            status : 303,
            headers : {
                "Location": "/download?blob-key=" + blobinfo.myFile
            }
        }; 
    };
    
Download
    
    exports.GET = function(env) {
        var params = new Request(env).params();
        blobs.serve(env, params["blob-key"]); 
        return {};
    }
*/
