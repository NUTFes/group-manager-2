//色　仕様に使う基本色
const green = "#34A854"
const red = "#FF6752"
const white = "#FFFFFF"
const gray = "#B2B2B2"
const black ="#000000"

//ステータス (A,B,C)　現在３種類
const StatusA = (props:{staA:number}) =>{

    let strdis="エラー"
    let bgcolor=black
    let strcolor="red"
    let brdcolor="red"

    if (props.staA===0){
        strdis="受付中";
        bgcolor=green;
        strcolor=white;
        brdcolor=green;
    } else if (props.staA===1){
        strdis="締切間近";
        bgcolor=red;
        strcolor=white;
        brdcolor=red;
    }else if (props.staA===2){
        strdis="受付終了";
        bgcolor=white;
        strcolor=gray;
        brdcolor=gray;
    }

    return(
    <div  style={{display:"flex",backgroundColor:bgcolor,width:100,height:30,borderRadius:15, justifyContent:"center" ,alignItems:"center",border:2,borderStyle:"solid",borderColor:brdcolor}}>
        <div className="px-{8} py-{2}" style={{display:"flex",width:64,height:23,justifyContent:"center" ,alignItems:"center",flexShrink:0,color:strcolor,fontSize:16}}>
        {strdis}  
        </div>
    </div>
    )
}

export {StatusA}

const StatusB = (props:{staB:number}) =>{

    let strdis="エラー"
    let bgcolor=black
    let strcolor="red" //これは"#FF6752"ではなく#FF0000のほうの赤
    let brdcolor="red"

    if (props.staB===0){
        strdis="登録済";
        bgcolor=white;
        strcolor=gray;
        brdcolor=gray;
    } else if (props.staB===1){
        strdis="未登録";
        bgcolor=red;
        strcolor=white;
        brdcolor=red;
    }

    return(
    <div  style={{display:"flex",backgroundColor:bgcolor,width:86,height:30,borderRadius:15, justifyContent:"center" ,alignItems:"center",border:2,borderStyle:"solid",borderColor:brdcolor}}>
        <div className="px-{8} py-{2}" style={{display:"flex",width:48,height:22,justifyContent:"center" ,alignItems:"center",flexShrink:0,color:strcolor,fontSize:16}}>
        {strdis}  
        </div>
    </div>
    )
}

export {StatusB}

const StatusC = (props:{staC:number}) =>{

    let strdis="エラー"
    let bgcolor=black
    let strcolor="red"
    let brdcolor="red"

    if (props.staC===0){
        strdis="不要";
        bgcolor=white;
        strcolor=gray;
        brdcolor=gray;
    } else if (props.staC===1){
        strdis="済";
        bgcolor=green;
        strcolor=white;
        brdcolor=green;
    }else if (props.staC===2){
        strdis="末";
        bgcolor=red;
        strcolor=white;
        brdcolor=red;
    }

    return(
    <div  style={{display:"flex",backgroundColor:bgcolor,width:56,height:30,borderRadius:15, justifyContent:"center" ,alignItems:"center",border:2,borderStyle:"solid",borderColor:brdcolor}}>
        <div className="px-{8} py-{2}" style={{display:"flex",width:48,height:19,justifyContent:"center" ,alignItems:"center",flexShrink:0,color:strcolor,fontSize:16}}>
        {strdis}  
        </div>
    </div>
    )
}

export {StatusC}

