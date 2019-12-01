let searchInput = document.querySelector('#Search input');
let buttonSearch = document.getElementById('buttonSearch');
let pictures = document.getElementById('pictures');
let footer = document.querySelector('.footer');
let favourite = document.getElementById('hrefFavourite');
let boxFavourite = document.getElementById('boxForFavourite');
let popupFavorite = document.querySelector('.popupForFavourite');
let boxPopupFavourite = document.querySelector('#boxFavourite');
let popupInfo = document.querySelector('.popupForInfo');
let closeFavorite = document.querySelector('.close');
let closeInfo = document.querySelectorAll('.close')[1];
let bathRoom = document.querySelector('.bathroom');
let room = document.querySelector('.room');
let address = document.querySelector('.address');
let price = document.querySelector('.price');
let imgInfo = document.querySelector('.imgInfo');

let countForMore = 1;
let arrFavourite = [];

function more(e) {
  countForMore++;
  querySearch(e)
}

function save() {
  localStorage.arr = JSON.stringify(arrFavourite)
}

if (localStorage.arr) {
  arrFavourite = JSON.parse(localStorage.arr)
}

function querySearch(e) {
  if (e.target.innerHTML === 'Search') {
    pictures.innerHTML = "";
    countForMore = 1
  }
  let text = searchInput.value.toLowerCase();
  fetch(`https://cors-anywhere.herokuapp.com/api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&listing_type=rent&number_of_results=4&page=${countForMore}&country=uk&listing_type=buy&place_name=${text}`).then(
    response => response.json()).then(objResponse =>
    objResponse.response
  )
    .then(result2 => {
      let more = document.createElement('a');
      footer.innerHTML = "";
      more.innerHTML = "Further";

      footer.appendChild(more);
      more.addEventListener('click', more);
      let arrPictures = result2.listings.map((elem) => {
        let picture = document.createElement('a');
        let icon = document.createElement('img');
        icon.className = 'star';
        icon.src = "images/noactive.png";
        arrFavourite.forEach((item) => {
          if (item.lister_url === elem.lister_url) {
            icon.src = "images/active.png"
          }
        });
        icon.addEventListener('click', function (e) {
          e.stopPropagation();
          let auxArr = arrFavourite.map((item) => item.lister_url);
          if (auxArr.indexOf(elem.lister_url) >= 0) {
            icon.src = "images/noactive.png";
            arrFavourite.splice(auxArr.indexOf(elem.lister_url), 1);
          } else {
            icon.src = "images/active.png";
            arrFavourite.push(elem);
          }
          save();
        });
        picture.innerHTML = `<img src=${elem.img_url}>`;
        picture.addEventListener('click', () => {
          popupInfo.classList.remove("hidden");
          imgInfo.src = elem.img_url;
          bathRoom.innerText = elem.bathroom_number;
          room.innerText = elem.room_number;
          address.innerText = elem.title;
          price.innerText = elem.price;
        });
        pictures.appendChild(picture);
        picture.appendChild(icon);
        return elem;
      });
      return arrPictures
    })
}

function Favourite() {
  popupFavorite.classList.remove("hidden");
  boxFavourite.innerHTML = "";
  arrFavourite.forEach((elem, index, arr) => {
    let favour = document.createElement('div');
    let closeFavour = document.createElement('img');
    favour.innerHTML = `<img src=${elem.img_url}>`;
    favour.addEventListener('click', () => {
      window.open(elem.lister_url)
    });
    boxFavourite.appendChild(favour);
    closeFavour.src = "images/close.png";
    closeFavour.className = "imgCloseFav";
    favour.className = "favour";
    favour.appendChild(closeFavour);
    closeFavour.addEventListener('click', (e) => {
      e.stopPropagation();
      let auxArr = arr.map((item) => item.img_url);
      arr.splice(auxArr.indexOf(e.target.previousSibling.src), 1);
      e.target.parentElement.remove();
      save();
      let images = pictures.querySelectorAll('img');
      let imgArr = [...images];
      imgArr.forEach((item) => {
        if (item.src === elem.img_url) {
          item.nextSibling.src = "images/noactive.png"
        }
      })
    })
  })
}

function Info() {
  popupInfo.classList.remove("hidden");
}

buttonSearch.addEventListener('click', querySearch);
favourite.addEventListener('click', Favourite);
closeFavorite.addEventListener('click', (e) => {
  e.stopPropagation();
  popupFavorite.classList.add("hidden")
});

closeInfo.addEventListener('click', () => {
  popupInfo.classList.add("hidden")
});
boxPopupFavourite.onmousedown = function (event) {

  let shiftX = event.clientX - boxPopupFavourite.getBoundingClientRect().left;
  let shiftY = event.clientY - boxPopupFavourite.getBoundingClientRect().top;

  // boxPopupFavourite.style.position = 'absolute';
  boxPopupFavourite.style.zIndex = 1000;
  moveAt(event.pageX, event.pageY);

  function moveAt(pageX, pageY) {
    boxPopupFavourite.style.left = pageX - shiftX + 'px';
    boxPopupFavourite.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('onmouseout', () => {
    document.removeEventListener('mousemove', onMouseMove)
  });
  boxPopupFavourite.onmouseup = function () {
    document.removeEventListener('mousemove', onMouseMove);

    boxPopupFavourite.onmouseup = null;
  };
};
boxPopupFavourite.ondragstart = function () {
  return false;
};


