const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
 var element=document.getElementById('desig');


signUpButton.addEventListener('click',() => 
	container.classList.add('right-panel-active'));



signInButton.addEventListener('click',() => 
	container.classList.remove('right-panel-active'));


function CheckDesignation(val){
	if(val=='Designation'&& val=='student' || val=='Designation'&& val=='teacher')
  		element.style.display='block';
 	else  
 		element.style.display='block';
}