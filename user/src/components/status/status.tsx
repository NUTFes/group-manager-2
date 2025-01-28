import { count } from "console"

//ステータス (A,B,C)　現在３種類

const StatusA = (props:{staA:string}) =>{
    let ctmbgstyle  //custom background style
    let ctmtxstyle  //custom text style
    let strdis  //string display

    if (props.staA=="reception"){
        strdis="受付中";
        ctmbgstyle="bg-[--main-color] border-[--main-color]"
        ctmtxstyle="text-[--base-color]"
    }else if (props.staA=="approaching"){
        strdis="締切間近";
        ctmbgstyle="bg-[--alert-color] border-[--alert-color]"
        ctmtxstyle="text-[--base-color]"
    }else if (props.staA=="closed"){
        strdis="受付終了";
        ctmbgstyle="bg-[--base-color] border-[--sub-color]"
        ctmtxstyle="text-[--sub-color]"
    }else{
        strdis="エラー";
        ctmbgstyle="bg-black border-red-600"
        ctmtxstyle="text-red-600"
    }

    const bscbgstyle="w-[100px] h-[30px] flex  items-center justify-center rounded-[15px] border-2 border-solid "  //basic background style
    const bsctxstyle="w-[92px] h-[23px] flex items-center justify-center shrink-0 text-[16px] "  //basic text style

    return(
        <div className={`${bscbgstyle} ${ctmbgstyle}`}>
            <div className={`${bsctxstyle} ${ctmtxstyle}`}>
                {strdis}  
            </div>
        </div>
    )
}

export {StatusA}

const StatusB = (props:{staB:string}) =>{
    let ctmbgstyle
    let ctmtxstyle
    let strdis

    if (props.staB=="registered"){
        strdis="登録済";
        ctmbgstyle="bg-[--base-color] border-[--sub-color]"
        ctmtxstyle="text-[--sub-color]"
    } else if (props.staB=="unregistered"){
        strdis="未登録";
        ctmbgstyle="bg-[--alert-color] border-[--alert-color]"
        ctmtxstyle="text-[--base-color]"
    }else{
        strdis="エラー";
        ctmbgstyle="bg-black border-red-600"
        ctmtxstyle="text-red-600"
    }

    const bscbgstyle="w-[86px] h-[30px] flex  items-center justify-center rounded-[15px] border-2 border-solid "
    const bsctxstyle="w-[78px] h-[22px] flex items-center justify-center shrink-0 text-[16px] "

    return(
        <div className={`${bscbgstyle} ${ctmbgstyle}`}>
            <div className={`${bsctxstyle} ${ctmtxstyle}`}>
                {strdis}
            </div>
        </div>
 
    )
}

export {StatusB}

const StatusC = (props:{staC:string}) =>{
    let ctmbgstyle
    let ctmtxstyle
    let strdis

    if (props.staC=="unnecessary"){
        strdis="不要";
        ctmbgstyle="bg-[--base-color] border-[--sub-color]"
        ctmtxstyle="text-[--sub-color]"
    } else if (props.staC=="done"){
        strdis="済";
        ctmbgstyle="bg-[--main-color] border-[--main-color]"
        ctmtxstyle="text-[--base-color]"
    }else if (props.staC=="not_yet"){
        strdis="末";
        ctmbgstyle="bg-[--alert-color] border-[--alert-color]"
        ctmtxstyle="text-[--base-color]"
    }else{
        strdis="エラー";
        ctmbgstyle="bg-black border-red-600"
        ctmtxstyle="text-red-600"
    }
    
    const bscbgstyle="w-[56px] h-[30px] flex  items-center justify-center rounded-[15px] border-2 border-solid "
    const bsctxstyle="w-[48px] h-[19px] flex items-center justify-center shrink-0 text-[16px] "

    return(
        <div className={`${bscbgstyle} ${ctmbgstyle}`}>
            <div className={`${bsctxstyle} ${ctmtxstyle}`}>
                {strdis}
            </div>
        </div>
    )
}

export {StatusC}

