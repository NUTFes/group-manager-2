import { count } from "console"

// 色　仕様に使う基本色(tailwind.config.txにあった。)
const green = "#34A854" //:--main-color
const red = "#FF6752"   //:--alart-color
const white = "#FFFFFF" //:--base-color
const gray = "#B2B2B2"  //:--sub-color
const black ="#000000"  //:

//ステータス (A,B,C)　現在３種類



// // 1パターン目
// const StatusA = (props:{staA:number}) =>{

//     let strdis="エラー"
//     let bgcolor=black
//     let strcolor="red"
//     let brdcolor="red"

//     if (props.staA===0){
//         strdis="受付中";
//         bgcolor=green;
//         strcolor=white;
//         brdcolor=green;
//     } else if (props.staA===1){
//         strdis="締切間近";
//         bgcolor=red;
//         strcolor=white;
//         brdcolor=red;
//     }else if (props.staA===2){
//         strdis="受付終了";
//         bgcolor=white;
//         strcolor=gray;
//         brdcolor=gray;
//     }

    

//     return(
    

//     <div  style={{display:"flex",backgroundColor:bgcolor,width:100,height:30,borderRadius:15, justifyContent:"center" ,alignItems:"center",border:2,borderStyle:"solid",borderColor:brdcolor}}>
//         <div className="px-{8} py-{2}" style={{display:"flex",width:64,height:23,justifyContent:"center" ,alignItems:"center",flexShrink:0,color:strcolor,fontSize:16}}>
//         {strdis}  
//         </div>
//     </div>
//     )
// }

// export {StatusA}


// 2パターン目
const StatusA = (props:{staA:number}) =>{
    let ctmbgstyle
    let ctmtxstyle
    let strdis

    if (props.staA===0){
        strdis="受付中";
        ctmbgstyle="bg-[--main-color] border-[--main-color]"
        ctmtxstyle="text-[--base-color]"
    }else if (props.staA===1){
        strdis="締切間近";
        ctmbgstyle="bg-[--alert-color] border-[--alert-color]"
        ctmtxstyle="text-[--base-color]"
    }else if (props.staA===2){
        strdis="受付終了";
        ctmbgstyle="bg-[--base-color] border-[--sub-color]"
        ctmtxstyle="text-[--sub-color]"
    }else{
        strdis="エラー";
        ctmbgstyle="bg-black border-red-600"
        ctmtxstyle="text-red-600"
    }

    const bscbgstyle="w-[100px] h-[30px] flex  items-center justify-center rounded-[15px] border-2 border-solid "
    const bsctxstyle="px-4 py-4 w-[100px] h-[23px] flex items-center justify-center shrink-0 text-[16px] "

    return(
<div className={`${bscbgstyle} ${ctmbgstyle}`}>
        <div className={`${bsctxstyle} ${ctmtxstyle}`}>
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

