function sv(){
	var message = document.getElementById('message');

	if(document.getElementById("regex").value === ""){
		message.innerText = "何か入力したらどうですか？";
		message.style.color="#e78B90";
		return;
	}
	
	//対象URLの登録
	try{
		var thisRegex = new RegExp(document.getElementById("regex").value);
		localStorage.setItem("targetURL", document.getElementById("regex").value);
		console.log(localStorage.getItem("targetURL"));
		message.innerText = "登録しました";
		message.style.color="#e78B90";
	}catch{
		message.innerText = "対象URLの正規表現が正しくありません";
		message.style.color="#e78B90";
	}
	
	//除外URLの登録
		if(document.getElementById("excregex").value === ""){
			document.getElementById("excregex").value = '(.*\\.)(jpg|jpeg|png|gif|svg|ico|css|js|woff|mp4|mp3|ts|m3u8|pdf|doc|docx|ppt|pptx|xls|xlsx|md)$';
	}
	
	try{
		var thisRegex = new RegExp(document.getElementById("excregex").value);
		localStorage.setItem("exclusionURL", document.getElementById("excregex").value);
		console.log(localStorage.getItem("exclusionURL"));
	}catch{
		message.innerText = "除外URLの正規表現が正しくありません";
		message.style.color="#e78B90";
	}
}

function rm(){
	const message = document.getElementById("log_message");
	localStorage.setItem("log","{}");
	message.innerText = "ログを消去しました";
	message.style.color="#e78B90";
	document.getElementById("logsize").innerText = String(localStorage.getItem("log").length)+" バイト";
}

function dl(){
	const log = localStorage.getItem("log");
	const blob = new Blob([log], { type: 'application/json' });
	let a = document.createElement('a');
	document.body.appendChild(a);
	a.href = window.URL.createObjectURL(blob);
	a.download = 'params_log.json';
	a.click();
	document.body.removeChild(a);
}

document.getElementById('save').addEventListener('click',sv);
document.getElementById('logrm').addEventListener('click',rm);
document.getElementById('logdl').addEventListener('click',dl);
document.getElementById('apply').addEventListener('click',()=>{browser.runtime.reload()});
document.getElementById("regex").value = localStorage.getItem("targetURL");
document.getElementById("excregex").value = localStorage.getItem("exclusionURL");
document.getElementById("logsize").innerText = String(localStorage.getItem("log").length)+" バイト";

document.getElementById('logview').addEventListener('click',()=>{window.open('/view/index.html')});