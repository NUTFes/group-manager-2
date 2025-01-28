import { count } from "console"

// 色　仕様に使う基本色(tailwind.config.txにあった。)
const green = "#34A854" //:--main-color
const red = "#FF6752"   //:--alart-color
const white = "#FFFFFF" //:--base-color
const gray = "#B2B2B2"  //:--sub-color
const black ="#000000"  //:

//ステータス (A,B,C)　現在３種類

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
    const bsctxstyle="px-4 py-2 w-[92px] h-[23px] flex items-center justify-center shrink-0 text-[16px] "

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
    let ctmbgstyle
    let ctmtxstyle
    let strdis

    if (props.staB===0){
        strdis="登録済";
        ctmbgstyle="bg-[--base-color] border-[--sub-color]"
        ctmtxstyle="text-[--sub-color]"
    } else if (props.staB===1){
        strdis="未登録";
        ctmbgstyle="bg-[--alert-color] border-[--alert-color]"
        ctmtxstyle="text-[--base-color]"
    }else{
        strdis="エラー";
        ctmbgstyle="bg-black border-red-600"
        ctmtxstyle="text-red-600"
    }

    const bscbgstyle="w-[86px] h-[30px] flex  items-center justify-center rounded-[15px] border-2 border-solid "
    const bsctxstyle="px-4 py-2 w-[78px] h-[22px] flex items-center justify-center shrink-0 text-[16px] "

    return(
        <div className={`${bscbgstyle} ${ctmbgstyle}`}>
            <div className={`${bsctxstyle} ${ctmtxstyle}`}>
                {strdis}
            </div>
        </div>
 
    )
}

export {StatusB}

const StatusC = (props:{staC:number}) =>{
    let ctmbgstyle
    let ctmtxstyle
    let strdis

    if (props.staC===0){
        strdis="不要";
        ctmbgstyle="bg-[--base-color] border-[--sub-color]"
        ctmtxstyle="text-[--sub-color]"
    } else if (props.staC===1){
        strdis="済";
        ctmbgstyle="bg-[--main-color] border-[--main-color]"
        ctmtxstyle="text-[--base-color]"
    }else if (props.staC===2){
        strdis="末";
        ctmbgstyle="bg-[--base-color] border-[--sub-color]"
        ctmtxstyle="text-[--sub-color]"
    }else{
        strdis="エラー";
        ctmbgstyle="bg-black border-red-600"
        ctmtxstyle="text-red-600"
    }
    
    const bscbgstyle="w-[56px] h-[30px] flex  items-center justify-center rounded-[15px] border-2 border-solid "
    const bsctxstyle="px-4 py-2 w-[48px] h-[19px] flex items-center justify-center shrink-0 text-[16px] "

    return(
        <div className={`${bscbgstyle} ${ctmbgstyle}`}>
            <div className={`${bsctxstyle} ${ctmtxstyle}`}>
                {strdis}
            </div>
        </div>
    )
}

export {StatusC}

