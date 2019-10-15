import { observer } from 'mobx-react';
import { observable } from 'mobx';
import axios from 'axios';

const appstate = observable({
  'isAuth': localStorage.mail != undefined ? true : false,
  'posts': Array(0),
  'formAdd': 1,
  'idUpdateItem': null
});

appstate.closePopUp = function(){
  document.querySelector('.overlay').style.display = "none";
  document.querySelector('.delete-item-block').style.display = "none";
}

appstate.updatePostsList = function(){
  axios({
    method: 'get',
    url: 'https://raysael.herokuapp.com/todo?author=' + localStorage['mail']
  }).catch(function(error){
    alert('Произошла ошибка');
  }).then((responce) => {
    // if(this._isMounted){
      appstate.posts = responce.data;
    // }
  });
}

appstate.addPost = function(e){
  e.preventDefault();
  let objAddPost = {
    title: document.querySelector('#drawer-title').value,
    description: document.querySelector('#drawer-description').value,
    author: localStorage.mail
  };
  for(let varibles in objAddPost) {
    if(objAddPost[varibles] == ''){
      alert('Заполните все поля!');
      return false;
    }
  }
  axios.post('https://raysael.herokuapp.com/todo', {
    author : objAddPost.author,
    title : objAddPost.title,
    description : objAddPost.description
  }).catch(function(error){
    alert('Произошла ошибка');
  }).then((responce) => {
    appstate.closeDrawer();
    if(responce.status == '201' || responce.status == '200'){
      document.querySelector('#drawer-title').value = null;
      document.querySelector('#drawer-description').value = null;
      let postsList = appstate.posts;
      postsList.push(responce.data);
      appstate.posts = postsList;
      this.closeDrawer();
    }
  });
}

appstate.closeDrawer = function(){
  if(document.querySelector('#add-item').disabled == false){
    let drawer = document.querySelector('.add-and-update-block');
    if(getComputedStyle(drawer).left == '0px') {
      // alert(1);
      document.querySelector('.overlay').style.display = "none";
      appstate.formAdd = true;
      appstate.idUpdateItem = null;
      drawer.style.left = '-' + getComputedStyle(drawer).width;
    }
  }
}

appstate.updatePost = function(e){
  e.preventDefault();
  let objUpdPost = {
    id: document.querySelector('#update-post-id').value,
    title: document.querySelector('#drawer-title').value,
    description: document.querySelector('#drawer-description').value
  };
  for(let varibles in objUpdPost) {
    if(objUpdPost[varibles] == ''){
      alert('Заполните все поля!');
      return false;
    }
  }
  axios({
    method: 'patch',
    url: 'https://raysael.herokuapp.com/todo/' + objUpdPost.id,
    data: {
      title: objUpdPost.title,
      description: objUpdPost.description
    }
  }).catch(function(error){
    alert('Произошла ошибка');
  }).then((responce) => {
    document.querySelector('#update-post-id').value = null;
    document.querySelector('#drawer-title').value = null;
    document.querySelector('#drawer-description').value = null;
    appstate.closeDrawer();
    if(responce.status == '201' || responce.status == '200'){
      appstate.closeDrawer();
      let postsList = appstate.posts;
      postsList.forEach((post, i, mass) => {
        if(post._id == objUpdPost.id) {
          postsList[i] = responce.data;
        }
      });
      appstate.posts = postsList;
    }
  });
}

appstate.deleteItem = function(e){
  e.preventDefault();
  let id = document.querySelector('#drop-post-id').value;
  axios({
    method: 'delete',
    url: 'https://raysael.herokuapp.com/todo/' + id
  }).catch(function(error){
    alert('Произошла ошибка');
  }).then((responce) => {
    let postsList = appstate.posts;
    let sliceElement = null;
    postsList.forEach((post, i, mass) => {
      if(post._id == id) {
        sliceElement = i;
      }
    });
    if(sliceElement != null) {
      delete postsList[sliceElement];
    }
    appstate.posts = postsList;
    appstate.closePopUp();
  });
}

export default appstate;
