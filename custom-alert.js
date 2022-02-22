export function customAlert(message=''){
    let can=false;
const customAlertWrapper=document.createElement('div');
customAlertWrapper.className='custom-alert'
const customAlertMesage=document.createElement('p');
customAlertMesage.textContent=message;
const confirmBtn=document.createElement('button');
confirmBtn.type='button';
confirmBtn.className='custom-alert-confirm-btn';
confirmBtn.textContent='confirm'
const cancelBtn=document.createElement('button');
cancelBtn.type='button';
cancelBtn.className='custom-alert-cancel-btn';
cancelBtn.textContent='cancel';
customAlertWrapper.appendChild(customAlertMesage);
customAlertWrapper.appendChild(confirmBtn);
customAlertWrapper.appendChild(cancelBtn);
const styleTag=document.createElement('style');
styleTag.textContent=`.custom-alert{
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 7px 14px #0003 ;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translate(-50%);
    background: #fff;
    z-index:1000;
  }
  .custom-alert button{
    cursor:pointer;
    padding: 0.5rem 1rem;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1rem;
  color: #fff;
  border-radius: 0.25rem;
  margin-top: 1rem;
  border: none;
  outline: none;
  box-shadow: 0 4px 8px #0002;
  }
  .custom-alert .custom-alert-confirm-btn{
    background: rgb(3, 160, 121);
    margin-right: 0.5rem;
  }
  .custom-alert .custom-alert-cancel-btn:hover,
  .custom-alert .custom-alert-confirm-btn:hover{
    opacity: 0.8;
  }
  .custom-alert .custom-alert-cancel-btn{
    background: rgb(194, 14, 14);
  }`;
  document.head.appendChild(styleTag);
document.body.appendChild(customAlertWrapper);
confirmBtn.onclick=()=>{
    can=true;
    document.body.removeChild(customAlertWrapper);
}
cancelBtn.onclick=()=>{
    can=false
    document.body.removeChild(customAlertWrapper);
}
return (can)

}