function clear(){
		//すべてのメッセージを消す
	document.getElementById("regex").ariaInvalid = false;
	document.getElementById("excregex").ariaInvalid = false;
	document.getElementById('regex-error-text').style.display = "none";
	document.getElementById('excregex-error-text').style.display = "none";
	document.getElementById("message").innerText = "";
}

function sv(){
	
	//すべてのメッセージを消す
	clear();
	
	if(document.getElementById("regex").value === ""){
		document.getElementById('regex-error-text').innerText = "＊この項目は入力必須です";
		document.getElementById('regex-error-text').style.display = "";
		document.getElementById("regex").ariaInvalid = true;
		return;
	}
	
	//対象URLの登録
	try{
		var thisRegex = new RegExp(document.getElementById("regex").value);
		localStorage.setItem("targetURL", document.getElementById("regex").value);
		console.log(localStorage.getItem("targetURL"));
	}catch{
		document.getElementById('regex-error-text').innerText = "＊正規表現の書式が誤っています";
		document.getElementById('regex-error-text').style.display = "";
		document.getElementById("regex").ariaInvalid = true;
		return;
	}
	
	//除外URLの登録
	if(document.getElementById("excregex").value === ""){
		document.getElementById("excregex").value = "^$"
	}
	
	try{
		var thisRegex = new RegExp(document.getElementById("excregex").value);
		localStorage.setItem("exclusionURL", document.getElementById("excregex").value);
		console.log(localStorage.getItem("exclusionURL"));
	}catch{
		document.getElementById('excregex-error-text').innerText = "＊正規表現の書式が誤っています";
		document.getElementById("excregex").ariaInvalid = true;
		document.getElementById('excregex-error-text').style.display = "";
		return;
	}
	
	document.getElementById("message").innerText = "登録しました";
}

function rm(){
	//すべてのメッセージを消す
	clear();
	
	const message = document.getElementById("log_message");
	localStorage.setItem("log","{}");
	message.innerText = "ログを消去しました";
	document.getElementById("logsize").innerText = String(localStorage.getItem("log").length)+" バイト";
}

function dl(){
	//すべてのメッセージを消す
	clear();
	
	const log = localStorage.getItem("log");
	const blob = new Blob([log], { type: 'application/json' });
	let a = document.createElement('a');
	document.body.appendChild(a);
	a.href = window.URL.createObjectURL(blob);
	a.download = 'params_log.json';
	a.click();
	document.body.removeChild(a);
}

function reset(){
	//すべてのメッセージを消す
	clear();
	
	localStorage.setItem("targetURL", 'htt(p|ps)://example.net($|/.*)');
	localStorage.setItem("exclusionURL", '(.*\\.)(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|mp4|mp3|ts|m3u8|pdf|doc|docx|ppt|pptx|xls|xlsx|md)$');
	message.innerText = "設定をリセットしました";
	document.getElementById("regex").value = localStorage.getItem("targetURL");
	document.getElementById("excregex").value = localStorage.getItem("exclusionURL");
	document.getElementById("logsize").innerText = String(localStorage.getItem("log").length)+" バイト";
}

document.getElementById('save').addEventListener('click',sv);
document.getElementById('logrm').addEventListener('click',rm);
document.getElementById('logdl').addEventListener('click',dl);
document.getElementById('reset').addEventListener('click',reset);
document.getElementById('apply').addEventListener('click',()=>{browser.runtime.reload()});
document.getElementById("regex").value = localStorage.getItem("targetURL");
document.getElementById("excregex").value = localStorage.getItem("exclusionURL");
document.getElementById("logsize").innerText = String(localStorage.getItem("log").length)+" バイト";
document.getElementById('logview').addEventListener('click',()=>{window.open('/view/index.html')});