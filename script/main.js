function parse_get(url){
	const get_req = url.split("?")[1];
	if(get_req === undefined){
		return Array();
	}
	
	var output = new Set();
	
	if(get_req.match("=")　&& get_req.match("&")){　　//2個以上の要素がある場合
		const params = get_req.split("&");
		for(var i = 0; i<params.length;i++){
			if(params[i].match("=")){ //valueがある場合
				output.add("GET."+ params[i].split("=")[0]);
			}else{//valueがない場合
				output.add("GET."+ params[i]);
			}
		}
	}else if(get_req.match("=") && !get_req.match("&")){　//要素が1個でvalueがある場合
		output.add("GET."+ get_req.split("=")[0]);
	}else{ //要素が1個でvalueが無い場合
		output.add("GET." + get_req);
	}
	
	return Array.from(output);
}

// ↓ Generated by chatGPT
function extractKeysFromJSON(jsonData, parentKey = '') {
  const keys = [];

  if (typeof jsonData === 'object' && !Array.isArray(jsonData)) {
    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        const childKey = parentKey ? `${parentKey}.${key}` : key;
        keys.push(...extractKeysFromJSON(jsonData[key], childKey));
      }
    }
  } else if (Array.isArray(jsonData)) {
    for (let i = 0; i < jsonData.length; i++) {
      const childKey = `${parentKey}.${i}`;
      keys.push(...extractKeysFromJSON(jsonData[i], childKey));
    }
  } else {
    keys.push(parentKey);
  }

  return keys;
}
// ↑ Generated by chatGPT

function logURL(requestDetails) {
	//URLの引数などを取り除く
	const url = requestDetails.url.split(/(#|\?|\/$|\/\?)/)[0];
	if(targetURL.test(requestDetails.url) && !exclusionURL.test(requestDetails.url)){
		//ログ記録ストレージを開く
		const log_str = localStorage.getItem("log");
		log = JSON.parse(log_str);
		
		//ログが存在しない場合
		if(log[url] === undefined){
			log[url] = {"params":[]};
		}
		
		//パラメタ一覧を追加していく
		
		//GETパラメタを追加
		const get_params = parse_get(requestDetails.url);
		log[url]["params"] = log[url]["params"].concat(get_params);
		
		//POSTパラメタを追加(json)
		if(requestDetails.method === "POST" && requestDetails.requestBody != null){
			
			if(!(requestDetails.requestBody.raw === undefined)){　// 生の値が入っている場合
				for(var i = 0 ; i < requestDetails.requestBody.raw.length ; i++){
					var body = "";
					try{ //文字列としてデコード
						body = String.fromCharCode.apply("", new Uint8Array(requestDetails.requestBody.raw[i].bytes));
					}catch{　//文字列としてデコードできない場合
						body = "";
					}
					
					try{ //jsonの場合
						const json = JSON.parse(body);
						log[url]["params"] = log[url]["params"].concat(extractKeysFromJSON(json,'JSON'));
					}catch{ //jsonでない生の値の場合
					}
					
				}
			}else{
				log[url]["params"] = log[url]["params"].concat(extractKeysFromJSON(requestDetails.requestBody.formData,"Form"));
			}
		}
		
		//重複排除
		var params = new Set(log[url]["params"]);
		log[url]["params"] = Array.from(params);
		
		//ストレージに保存
		localStorage.setItem("log",JSON.stringify(log));
		
	}
}

//ログ記録ストレージを初期化する
try{
	var log = localStorage.getItem("log");
	JSON.parse(log);
	if(log == null){
		localStorage.setItem("log","{}")
	}
}catch{
	localStorage.setItem("log","{}")
}

//ターゲットURLを初期化する
if(localStorage.getItem("targetURL") === null || localStorage.getItem("exclusionURL") === null){
	localStorage.setItem("targetURL", 'htt(p|ps)://example.net/.*');
	localStorage.setItem("exclusionURL", '(.*\\.)(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|mp4|mp3|ts|m3u8|pdf|doc|docx|ppt|pptx|xls|xlsx|md)$');
	browser.runtime.reload();
}

//ターゲットURLの読み込み
const targetURL = new RegExp(localStorage.getItem("targetURL"));
const exclusionURL = new RegExp(localStorage.getItem("exclusionURL"));

//バックグラウンドスクリプトの起動
browser.webRequest.onBeforeRequest.addListener(
logURL,
{urls: ["<all_urls>"]},
["requestBody"]
);
