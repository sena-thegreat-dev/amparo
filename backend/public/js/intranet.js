const adminViews=document.querySelectorAll('.admin-view');
const adminNav=document.querySelectorAll('.admin-nav-item');
const adminCrumbs={'admin-dashboard':'Administração / Dashboard','admin-users':'Administração / Usuários','admin-docs':'Administração / Documentos','admin-reconciliation':'Administração / Conciliação','admin-occurrences':'Administração / Ocorrências','admin-audit':'Administração / Auditoria'};
const adminToast=document.querySelector('#admin-toast');let adminToastTimeout;
function showAdminToast(message){adminToast.textContent=message;adminToast.classList.add('show');clearTimeout(adminToastTimeout);adminToastTimeout=setTimeout(()=>adminToast.classList.remove('show'),3300)}
function openAdminSection(id,{writeHash=true}={}){if(!adminCrumbs[id])return;adminViews.forEach(view=>{const active=view.id===id;view.classList.toggle('active',active);view.setAttribute('aria-hidden',String(!active))});adminNav.forEach(item=>{const active=item.dataset.section===id;item.classList.toggle('active',active);item.setAttribute('aria-current',active?'page':'false')});document.querySelector('#admin-breadcrumb').textContent=adminCrumbs[id];document.querySelector('#admin-sidebar').classList.remove('open');document.querySelector('.admin-mobile-menu').setAttribute('aria-expanded','false');if(writeHash)history.replaceState(null,'',`#${id}`);window.scrollTo({top:0,behavior:'smooth'});}
adminNav.forEach(item=>item.addEventListener('click',()=>openAdminSection(item.dataset.section)));
document.addEventListener('click',(event)=>{const go=event.target.closest('[data-go-section]');if(go)openAdminSection(go.dataset.goSection);const toastTarget=event.target.closest('[data-toast]');if(toastTarget)showAdminToast(toastTarget.dataset.toast)});
document.querySelector('.admin-mobile-menu').addEventListener('click',()=>{const side=document.querySelector('#admin-sidebar');const isOpen=side.classList.toggle('open');document.querySelector('.admin-mobile-menu').setAttribute('aria-expanded',String(isOpen));document.querySelector('.admin-mobile-menu').setAttribute('aria-label',isOpen?'Fechar menu':'Abrir menu')});
document.querySelector('#user-search').addEventListener('input',(event)=>{const needle=event.target.value.toLowerCase().trim();document.querySelectorAll('#users-table tbody tr').forEach(row=>row.hidden=needle!==''&&!row.textContent.toLowerCase().includes(needle));});
document.querySelector('#approve-docs').addEventListener('click',()=>showAdminToast('Aprovação preparada para confirmação. Nenhuma decisão real foi aplicada.'));
document.querySelector('#register-note').addEventListener('click',()=>showAdminToast('Nota revisada e pronta para confirmação. O caso continua aberto nesta demonstração.'));
adminViews.forEach(view=>view.setAttribute('role','region'));
adminNav.forEach(item=>item.setAttribute('aria-controls',item.dataset.section));
const initialAdminSection=document.body.dataset.activeView||location.hash.slice(1);
openAdminSection(adminCrumbs[initialAdminSection]?initialAdminSection:'admin-dashboard',{writeHash:false});
window.addEventListener('hashchange',()=>openAdminSection(location.hash.slice(1),{writeHash:false}));
