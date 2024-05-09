import { DB } from "./db.js";
import { cniValidator, emailValidator, telephoneValidator } from "./utils.js";

/** Declaration Variable*/
const formAddApp = document.querySelector("#formAddApp");
const studentImage = document.querySelector("#studentImage");
const imageId = document.querySelector("#image");
const referentielId = document.querySelector("#referentielId");
const tbodyList = document.querySelector("#tbody-list");
const promo = document.querySelector("#promo");
const parNom = document.querySelector("#parNom");
const parPrenom = document.querySelector("#parPrenom");
const parEmail = document.querySelector("#parEmail");
const parGenre = document.querySelector("#parGenre");
const parTel = document.querySelector("#parTel");
const parRef = document.querySelector("#parRef");
const searchFilter = document.querySelector("#searchFilter");
const formControls = document.querySelectorAll(".form-control");
const formControl2 = document.querySelectorAll(".form-control2");
const pagination = document.querySelector(".pagination");
let peer_page = 5;
let listeApprenantFilter;
let listeApprenantForTri;
// let promotion_active;

/** Declaration Fonction*/

const findAllPromotions = () => {
  return DB.promotions;
};

const findAllApprenants = () => {
  return DB.apprenants;
};

const addDbApprenants = (apprenant) => {
  return DB.apprenants.push(apprenant);
};

const findAllReferentiels = () => {
  return DB.referentiels;
};

const findAllRefPromo = () => {
  let refPromo = DB.referentiels_promotions;
  let promotions = findAllPromotions();
  let referentiels = findAllReferentiels();
  let results = [];

  refPromo.forEach((rp, index) => {
    promotions.forEach((promo) => {
      if (rp.idPromotion == promo.numPromo) {
        results.push({ ...refPromo[index], ...promo });
      }
    });

    referentiels.forEach((ref) => {
      if (rp.idReferentiel == ref.id) {
        results[results.length - 1] = {
          ...results[results.length - 1],
          ...ref,
        };
      }
    });
  });
  return results;
};

const findPromoActive = () => {
  return DB.promotion_active;
};

const findRefByPromo = (promo) => {
  return findAllRefPromo().filter((rp) => rp.idPromotion == promo);
};

const findRefById = (id) => {
  return findAllReferentiels().filter((ref) => ref.id == id)[0];
};

const buildSelectRef = () => {
  let referentiels = findRefByPromo(findPromoActive());
  referentiels.forEach((ref) => {
    let templateSelectRef = `<option value="${ref.id}">${ref.libelle}</option>`;
    referentielId.insertAdjacentHTML("beforeend", templateSelectRef);
  });
};
const templateListApprenant = (apprenant) => {
  return `
  <tr class="line" id="lineApprenant" data-id="${apprenant.id}">
  <td class="bloc">
    <div class="col-bas">
      <img src="${apprenant.image}" width="30px" />
    </div>
  </td>
  <td class="bloc">
    <div class="col-bas toedit" style="color: rgb(29, 109, 29)" data-toedit="nom">
      ${apprenant.nom}
    </div>
  </td>
  <td class="bloc">
    <div class="col-bas toedit" style="color: rgb(29, 109, 29)" data-toedit="prenom">
    ${apprenant.prenom}
    </div>
  </td>
  <td class="bloc">
    <div class="col-bas email toedit" data-toedit="email"> ${
      apprenant.email
    }</div>
  </td>
  <td class="bloc">
    <div class="col-bas toedit" data-toedit="genre"> ${
      apprenant.genre == 1 ? "M" : "F"
    }</div>
  </td>
  <td class="bloc">
    <div class="col-bas toedit" data-toedit="telephone"> ${
      apprenant.telephone
    }</div>
  </td>
  <td class="bloc">
    <div class="col-bas">${findRefById(apprenant.referentiel).libelle}</div>
  </td>
  <td class="bloc">
    <button type="button" class="btn-edit" 
    onclick="window.location.href='#popupEdit'"
     >Editer</button>
  </td>
</tr>
  `;
};
const buildListApprenants = () => {
  listeApprenantFilter.forEach((apprenant) => {
    tbodyList.insertAdjacentHTML("beforeend", templateListApprenant(apprenant));
  });
};

const addTempApprenant = function (apprenant) {
  tbodyList.insertAdjacentHTML("beforeend", templateListApprenant(apprenant));
  addDbApprenants(apprenant);
  buildTemplatePagination(listeApprenantFilter);
  listeApprenantFilter = paginateList(listeApprenantFilter, 1, 5);
  removeListElement();
  buildListApprenants();
  eventForAllApprenants();
  eventLoadPopUpEditApprenants();
};

const showSuccees = (fils) => {
  const parent = fils.parentNode;
  parent.className = "content";
};

const getInputName = (input) =>
  input.id.charAt(0).toUpperCase() + input.id.slice(1);

const showError = (fils, msg) => {
  const parent = fils.parentNode;
  parent.className = "content error";
  parent.querySelector("span").innerText = msg;
};

const checkLength = (input, min, max) => {
  if (input.value.length < min) {
    showError(
      input,
      `${getInputName(input)} doit contenir au moins ${min} caractères`
    );
  } else if (input.value.length > max) {
    showError(
      input,
      `${getInputName(input)} doit contenir au plus ${max} caractères`
    );
  } else {
    showSuccees(input);
  }
};

const checkEmail = (input) => {
  let valid = true;
  if (!emailValidator(input.value)) {
    valid = false;
    showError(input, `${getInputName(input)} n'est pas valide`);
  } else {
    showSuccees(input);
  }
  return valid;
};

const checkCni = (input) => {
  let valid = true;
  if (!cniValidator(input.value)) {
    valid = false;
    showError(
      input,
      `${getInputName(input)} n'est pas valide (X XXX XXXX XXXXX)`
    );
  } else {
    showSuccees(input);
  }
  return valid;
};

const checkTelephone = (input) => {
  let valid = true;
  if (!telephoneValidator(input.value)) {
    valid = false;
    showError(input, `${getInputName(input)} n'est pas valide (XXXXXXXXX)`);
  } else {
    showSuccees(input);
  }
  return valid;
};

const checkRequire = (input) => {
  if (input.value.trim() === "") {
    showError(input, `${getInputName(input)} est requis`);
  } else {
    showSuccees(input);
  }
};

const checkRequireGlobal = (inputArray) => {
  let valid = true;
  inputArray.forEach((input) => {
    const parent = input.parentNode;
    if (input.value.trim() === "") {
      valid = false;
      parent.className = "content error";
      showError(input, `${getInputName(input)} est requis`);
    } else {
      showSuccees(input);
    }
  });
  return valid;
};

const emptyInputAddApprenant = (inputArray) => {
  inputArray.forEach((input) => {
    if (input.id != "promo") {
      input.value = "";
    }
  });
};

const genererMaricule = (id, promo) => {
  let date = new Date();
  let year = date.getFullYear();

  return "MAT" + year + "_" + id + "_" + promo;
};

const editApprenantToDB = (id, editApprenant) => {
  let result;
  DB.apprenants.map((apprenant, index) => {
    if (apprenant.id == id) {
      DB.apprenants[index] = Object.assign({}, apprenant, editApprenant);
      result = Object.assign({}, apprenant, editApprenant);
    }
    return apprenant;
  });
  return result;
};

const editApprenantToListeTri = (id, editApprenant) => {
  let result;
  listeApprenantForTri.forEach((apprenant, index) => {
    if (apprenant.id == id) {
      listeApprenantForTri[index] = Object.assign({}, apprenant, editApprenant);
      result = Object.assign({}, apprenant, editApprenant);
    }
  });
};

const editApprenantToListeFilter = (id, editApprenant) => {
  let result;
  listeApprenantFilter.forEach((apprenant, index) => {
    if (apprenant.id == id) {
      listeApprenantFilter[index] = Object.assign({}, apprenant, editApprenant);
      result = Object.assign({}, apprenant, editApprenant);
    }
  });
};

const eventForAllApprenants = () => {
  let lineApprenants = document.querySelectorAll("#lineApprenant");
  lineApprenants.forEach((lineApprenant) => {
    let appColumns = lineApprenant.querySelectorAll(".toedit");
    let valueToEdit = "";
    // Liste of Events for the Apprenants
    appColumns.forEach((appColumn) => {
      let parentAppColumn = appColumn.parentElement.parentElement;
      appColumn.addEventListener("dblclick", (appColumnEvent) => {
        appColumn.contentEditable = true;
        appColumn.classList.add("toedit-form");
        valueToEdit = appColumn.textContent.trim();
      });
      appColumn.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          appColumn.contentEditable = false;
          appColumn.classList.remove("toedit-form");
          if (valueToEdit != appColumn.textContent.trim()) {
            let userId = parseInt(parentAppColumn.dataset.id);
            let editApprenant = {};
            if (appColumn.dataset.toedit == "nom") {
              editApprenant.nom = appColumn.textContent.trim();
            } else if (appColumn.dataset.toedit == "prenom") {
              editApprenant.prenom = appColumn.textContent.trim();
            } else if (appColumn.dataset.toedit == "email") {
              editApprenant.email = appColumn.textContent.trim();
            } else if (appColumn.dataset.toedit == "telephone") {
              editApprenant.telephone = appColumn.textContent.trim();
            } else if (appColumn.dataset.toedit == "genre") {
              if (appColumn.textContent.trim() == "M") {
                editApprenant.genre = 1;
              } else if (appColumn.textContent.trim() == "F") {
                editApprenant.genre = 0;
              }
            }
            let resultEdit = editApprenantToDB(userId, editApprenant);
            listeApprenantFilter.map((apprenant, index) => {
              if (resultEdit.id == apprenant.id) {
                listeApprenantFilter[index] = { ...resultEdit };
              }
            });
            // console.log(listeApprenantFilter);
            listeApprenantForTri.map((apprenant, index) => {
              if (resultEdit.id == apprenant.id) {
                listeApprenantForTri[index] = { ...resultEdit };
              }
            });
            // console.log(listeApprenantForTri);
          }
        } else {
          // event.preventDefault();
        }
      });
    });
  });
};

const eventForOneApprenant = (lineApprenant) => {
  let appColumns = lineApprenant.querySelectorAll(".toedit");
  let valueToEdit = "";
  // Liste of Events for the Apprenants
  appColumns.forEach((appColumn) => {
    let parentAppColumn = appColumn.parentElement.parentElement;
    appColumn.addEventListener("dblclick", (appColumnEvent) => {
      appColumn.contentEditable = true;
      appColumn.classList.add("toedit-form");
      valueToEdit = appColumn.textContent.trim();
    });
    appColumn.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        appColumn.contentEditable = false;
        appColumn.classList.remove("toedit-form");
        if (valueToEdit != appColumn.textContent.trim()) {
          let userId = parseInt(parentAppColumn.dataset.id);
          let editApprenant = {};
          if (appColumn.dataset.toedit == "nom") {
            editApprenant.nom = appColumn.textContent.trim();
          } else if (appColumn.dataset.toedit == "prenom") {
            editApprenant.prenom = appColumn.textContent.trim();
          } else if (appColumn.dataset.toedit == "email") {
            editApprenant.email = appColumn.textContent.trim();
          } else if (appColumn.dataset.toedit == "telephone") {
            editApprenant.telephone = appColumn.textContent.trim();
          } else if (appColumn.dataset.toedit == "genre") {
            if (appColumn.textContent.trim() == "M") {
              editApprenant.genre = 1;
            } else if (appColumn.textContent.trim() == "F") {
              editApprenant.genre = 0;
            }
          }
          let resultEdit = editApprenantToDB(userId, editApprenant);
          listeApprenantFilter.map((apprenant, index) => {
            if (resultEdit.id == apprenant.id) {
              listeApprenantFilter[index] = { ...resultEdit };
            }
          });
          // console.log(listeApprenantFilter);
          listeApprenantForTri.map((apprenant, index) => {
            if (resultEdit.id == apprenant.id) {
              listeApprenantForTri[index] = { ...resultEdit };
            }
          });
          // console.log(listeApprenantForTri);
        }
      } else {
        // event.preventDefault();
      }
    });
  });
};

const eventLoadPopUpEditApprenants = function () {
  let formEditApp = document.querySelector("#formEditApp");
  let studentImageEdit = formEditApp.querySelector("img[id='studentImage']");
  let nomEdit = formEditApp.querySelector("input[name='nom']");
  let prenomEdit = formEditApp.querySelector("input[name='prenom']");
  let emailEdit = formEditApp.querySelector("input[name='email']");
  let imageEdit = formEditApp.querySelector("input[name='image']");
  let telephoneEdit = formEditApp.querySelector("input[name='telephone']");
  let genreEdit = formEditApp.querySelector("select[name='sexe']");
  let promoEdit = formEditApp.querySelector("input[name='promo']");
  let dateNaissanceEdit = formEditApp.querySelector(
    "input[name='dateNaissance']"
  );
  let cniEdit = formEditApp.querySelector("input[name='cni']");
  let lieu_naissanceEdit = formEditApp.querySelector(
    "input[name='lieu_naissance']"
  );
  let referentielEdit = formEditApp.querySelector("select[name='referentiel']");
  let formDatas = new FormData(formEditApp);

  let lineApprenants = document.querySelectorAll("#lineApprenant");
  lineApprenants.forEach((lineApprenant) => {
    let btnEdit = lineApprenant.querySelector(".btn-edit");
    btnEdit.addEventListener("click", (e) => {
      // let parentAppColumn = appColumn.parentElement.parentElement;
      let userId = parseInt(lineApprenant.dataset.id);
      const idInput = document.createElement("input");
      idInput.type = "hidden";
      idInput.name = "idApp";
      idInput.id = "idApp";
      idInput.value = userId;
      formEditApp.appendChild(idInput);
      let user = findAllApprenants().find(
        (apprenant) => apprenant.id == userId
      );
      // console.log(user);
      // console.log(userId);
      studentImageEdit.src = user.image;
      nomEdit.value = user.nom;
      prenomEdit.value = user.prenom;
      emailEdit.value = user.email;
      imageEdit.value = user.image;
      telephoneEdit.value = user.telephone;
      promoEdit.value = user.promotion;
      dateNaissanceEdit.value = user.dateNaissance;
      cniEdit.value = user.numeroCNI;
      lieu_naissanceEdit.value = user.lieuNaissance;

      for (let i = 0; i < genreEdit.options.length; i++) {
        if (genreEdit.options[i].value == user.genre) {
          genreEdit.options[i].selected = true;
          break;
        }
      }

      for (let j = 0; j < referentielEdit.options.length; j++) {
        if (referentielEdit.options[j].value == user.referentiel) {
          referentielEdit.options[j].selected = true;
          break;
        }
      }
    });
  });
};

function removeListElement() {
  let lineApprenants = document.querySelectorAll("#lineApprenant");
  lineApprenants.forEach((lineApprenant) => {
    lineApprenant.remove();
  });
}

const buildTemplatePagination = (listeApprenantFilter) => {
  let templatePagination = "";
  for (let i = 1; i <= Math.ceil(listeApprenantFilter.length / 5); i++) {
    templatePagination += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`;
  }
  pagination.innerHTML = templatePagination;
  let pageItems = pagination.querySelectorAll(".page-item");
  pageItems.forEach((pageItem) => {
    pageItem.addEventListener("click", (e) => {
      let page = e.target.innerText;
      let items = paginateList(listeApprenantFilter, page, 5);
      // listeApprenantFilter = paginateList(listeApprenantFilter, page, 5);
      removeListElement();
      items.forEach((item) => {
        tbodyList.insertAdjacentHTML("beforeend", templateListApprenant(item));
      });
      eventForAllApprenants();
      eventLoadPopUpEditApprenants();
    });
  });
};

function paginateList(items, currentPage, itemsPerPage) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return items.slice(startIndex, endIndex);
}

function sortingTable(param, order, listeApprenantForTri) {
  if (param == "nom") {
    if (order == "asc") {
      listeApprenantForTri.sort((a, b) => b.nom.localeCompare(a.nom));
    }
    if (order == "desc") {
      listeApprenantForTri.sort((a, b) => a.nom.localeCompare(b.nom));
    }
  } else if (param == "prenom") {
    if (order == "asc") {
      listeApprenantForTri.sort((a, b) => b.prenom.localeCompare(a.prenom));
    }
    if (order == "desc") {
      listeApprenantForTri.sort((a, b) => a.prenom.localeCompare(b.prenom));
    }
  } else if (param == "email") {
    if (order == "asc") {
      listeApprenantForTri.sort((a, b) => b.email.localeCompare(a.email));
    }
    if (order == "desc") {
      listeApprenantForTri.sort((a, b) => a.email.localeCompare(b.email));
    }
  } else if (param == "genre") {
    if (order == "asc") {
      listeApprenantForTri.sort((a, b) => a.genre - b.genre);
    }
    if (order == "desc") {
      listeApprenantForTri.sort((a, b) => b.genre - a.genre);
    }
  } else if (param == "telephone") {
    if (order == "asc") {
      listeApprenantForTri.sort((a, b) =>
        b.telephone.localeCompare(a.telephone)
      );
    }
    if (order == "desc") {
      listeApprenantForTri.sort((a, b) =>
        a.telephone.localeCompare(b.telephone)
      );
    }
  } else if (param == "referentiel") {
    if (order == "asc") {
      listeApprenantForTri.sort((a, b) =>
        findRefById(b.referentiel).libelle.localeCompare(
          findRefById(a.referentiel).libelle
        )
      );
    }
    if (order == "desc") {
      listeApprenantForTri.sort((a, b) =>
        findRefById(a.referentiel).libelle.localeCompare(
          findRefById(b.referentiel).libelle
        )
      );
    }
  }
}

/** Initialisation */
listeApprenantFilter = findAllApprenants();
listeApprenantForTri = findAllApprenants();
buildTemplatePagination(listeApprenantFilter);
listeApprenantFilter = paginateList(listeApprenantFilter, 1, 5);
promo.value = findPromoActive();
promo.setAttribute("disabled", true);
buildSelectRef();
buildListApprenants();
eventForAllApprenants();
eventLoadPopUpEditApprenants();

/** Evenements */

imageId.addEventListener("change", (evt) => {
  studentImage.setAttribute("src", imageId.value);
});

formAddApp.addEventListener("submit", (e) => {
  console.log(2);
  e.preventDefault();
  let email = formAddApp.querySelector("#email");
  let cni = formAddApp.querySelector("#cni");
  let telephone = formAddApp.querySelector("#telephone");

  if (checkRequireGlobal(formControls)) {
    if (checkEmail(email) && checkCni(cni) && checkTelephone(telephone)) {
      let id = findAllApprenants()[findAllApprenants().length - 1].id + 1;
      let mat = genererMaricule(id, findPromoActive());
      let apprenant = {
        id: id,
        matricule: mat,
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        genre: "",
        dateNaissance: "",
        lieuNaissance: "",
        numeroCNI: "",
        image: "",
        referentiel: "",
        promotion: "",
      };

      formControls.forEach((input) => {
        if (input.id == "image") {
          apprenant.image = input.value;
        } else if (input.id == "nom") {
          apprenant.nom = input.value;
        } else if (input.id == "prenom") {
          apprenant.prenom = input.value;
        } else if (input.id == "email") {
          apprenant.email = input.value;
        } else if (input.id == "telephone") {
          apprenant.telephone = input.value;
        } else if (input.id == "sexe") {
          apprenant.genre = input.value;
        } else if (input.id == "dateNaissance") {
          apprenant.dateNaissance = input.value;
        } else if (input.id == "lieu_naissance") {
          apprenant.lieuNaissance = input.value;
        } else if (input.id == "cni") {
          apprenant.numeroCNI = input.value;
        } else if (input.id == "referentielId") {
          apprenant.referentiel = input.value;
        } else if (input.id == "promo") {
          apprenant.promotion = input.value;
        }
      });

      addTempApprenant(apprenant);
      // addDbApprenants(apprenant);
      listeApprenantFilter.push(apprenant);
      buildTemplatePagination(listeApprenantFilter);
      listeApprenantFilter = paginateList(listeApprenantFilter, 1, 5);
      emptyInputAddApprenant(formControls);
      eventForAllApprenants();
    }
  }
});

formEditApp.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = formEditApp.querySelector("#email");
  let idApp = parseInt(formEditApp.querySelector("#idApp").value);
  let cni = formEditApp.querySelector("#cni");
  let telephone = formEditApp.querySelector("#telephone");
  const trLine = tbodyList.querySelector(`tr[data-id="${idApp}"]`);
  console.log(trLine);
  const trColumns = trLine.querySelectorAll(".col-bas");

  if (checkRequireGlobal(formControl2)) {
    if (checkEmail(email) && checkCni(cni) && checkTelephone(telephone)) {
      let apprenant = {};

      formControl2.forEach((input) => {
        if (input.id == "image") {
          apprenant.image = input.value;
        } else if (input.id == "nom") {
          apprenant.nom = input.value;
        } else if (input.id == "prenom") {
          apprenant.prenom = input.value;
        } else if (input.id == "email") {
          apprenant.email = input.value;
        } else if (input.id == "telephone") {
          apprenant.telephone = input.value;
        } else if (input.id == "sexe") {
          apprenant.genre = input.value;
        } else if (input.id == "dateNaissance") {
          apprenant.dateNaissance = input.value;
        } else if (input.id == "lieu_naissance") {
          apprenant.lieuNaissance = input.value;
        } else if (input.id == "cni") {
          apprenant.numeroCNI = input.value;
        } else if (input.id == "referentielId") {
          apprenant.referentiel = parseInt(input.value);
        } else if (input.id == "promo") {
          apprenant.promotion = input.value;
        }
      });

      editApprenantToDB(idApp, apprenant);
      editApprenantToListeTri(idApp, apprenant);
      editApprenantToListeFilter(idApp, apprenant);

      trColumns[1].innerText = apprenant.nom;
      trColumns[2].innerText = apprenant.prenom;
      trColumns[3].innerText = apprenant.email;
      trColumns[4].innerText = apprenant.genre == 1 ? "M" : "F";
      trColumns[5].innerText = apprenant.telephone;
      trColumns[6].innerText = findRefById(apprenant.referentiel).libelle;
      formEditApp.querySelector("#idApp").remove();
    }
  }
});

searchFilter.addEventListener("input", (evt) => {
  if (evt.target.value.length >= 3) {
    let filter = evt.target.value.toLowerCase();
    listeApprenantFilter = findAllApprenants().filter((apprenant) => {
      return (
        apprenant.nom.toLowerCase().includes(filter) ||
        apprenant.prenom.toLowerCase().includes(filter)
        // ||apprenant.email.toLowerCase().includes(filter)
      );
    });

    buildTemplatePagination(listeApprenantFilter);
    listeApprenantFilter = paginateList(listeApprenantFilter, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else {
    listeApprenantFilter = findAllApprenants();

    buildTemplatePagination(listeApprenantFilter);
    listeApprenantFilter = paginateList(listeApprenantFilter, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  }
});

parNom.addEventListener("click", (e) => {
  if (
    !parNom.children[0].classList.contains("filter-color") &&
    !parNom.children[1].classList.contains("filter-color")
  ) {
    parNom.children[0].classList.add("filter-color");
    console.log(listeApprenantForTri);
    sortingTable("nom", "asc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else if (parNom.children[0].classList.contains("filter-color")) {
    parNom.children[0].classList.toggle("filter-color");
    parNom.children[1].classList.toggle("filter-color");
    sortingTable("nom", "desc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else if (parNom.children[1].classList.contains("filter-color")) {
    parNom.children[0].classList.toggle("filter-color");
    parNom.children[1].classList.toggle("filter-color");
    sortingTable("nom", "asc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  }
});

parPrenom.addEventListener("click", (e) => {
  if (
    !parPrenom.children[0].classList.contains("filter-color") &&
    !parPrenom.children[1].classList.contains("filter-color")
  ) {
    parPrenom.children[0].classList.add("filter-color");
    console.log(listeApprenantForTri);
    sortingTable("prenom", "asc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else if (parPrenom.children[0].classList.contains("filter-color")) {
    parPrenom.children[0].classList.toggle("filter-color");
    parPrenom.children[1].classList.toggle("filter-color");
    sortingTable("prenom", "desc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else if (parPrenom.children[1].classList.contains("filter-color")) {
    parPrenom.children[0].classList.toggle("filter-color");
    parPrenom.children[1].classList.toggle("filter-color");
    sortingTable("prenom", "asc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  }
});

parEmail.addEventListener("click", (e) => {
  if (
    !parEmail.children[0].classList.contains("filter-color") &&
    !parEmail.children[1].classList.contains("filter-color")
  ) {
    parEmail.children[0].classList.add("filter-color");
    console.log(listeApprenantForTri);
    sortingTable("email", "asc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else if (parEmail.children[0].classList.contains("filter-color")) {
    parEmail.children[0].classList.toggle("filter-color");
    parEmail.children[1].classList.toggle("filter-color");
    sortingTable("email", "desc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else if (parEmail.children[1].classList.contains("filter-color")) {
    parEmail.children[0].classList.toggle("filter-color");
    parEmail.children[1].classList.toggle("filter-color");
    sortingTable("email", "asc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  }
});

parGenre.addEventListener("click", (e) => {
  if (
    !parGenre.children[0].classList.contains("filter-color") &&
    !parGenre.children[1].classList.contains("filter-color")
  ) {
    parGenre.children[0].classList.add("filter-color");
    console.log(listeApprenantForTri);
    sortingTable("genre", "asc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else if (parGenre.children[0].classList.contains("filter-color")) {
    parGenre.children[0].classList.toggle("filter-color");
    parGenre.children[1].classList.toggle("filter-color");
    sortingTable("genre", "desc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else if (parGenre.children[1].classList.contains("filter-color")) {
    parGenre.children[0].classList.toggle("filter-color");
    parGenre.children[1].classList.toggle("filter-color");
    sortingTable("genre", "asc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  }
});

parTel.addEventListener("click", (e) => {
  if (
    !parTel.children[0].classList.contains("filter-color") &&
    !parTel.children[1].classList.contains("filter-color")
  ) {
    parTel.children[0].classList.add("filter-color");
    console.log(listeApprenantForTri);
    sortingTable("telephone", "asc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else if (parTel.children[0].classList.contains("filter-color")) {
    parTel.children[0].classList.toggle("filter-color");
    parTel.children[1].classList.toggle("filter-color");
    sortingTable("telephone", "desc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else if (parTel.children[1].classList.contains("filter-color")) {
    parTel.children[0].classList.toggle("filter-color");
    parTel.children[1].classList.toggle("filter-color");
    sortingTable("telephone", "asc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  }
});

parRef.addEventListener("click", (e) => {
  if (
    !parRef.children[0].classList.contains("filter-color") &&
    !parRef.children[1].classList.contains("filter-color")
  ) {
    parRef.children[0].classList.add("filter-color");
    console.log(listeApprenantForTri);
    sortingTable("referentiel", "asc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else if (parRef.children[0].classList.contains("filter-color")) {
    parRef.children[0].classList.toggle("filter-color");
    parRef.children[1].classList.toggle("filter-color");
    sortingTable("referentiel", "desc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  } else if (parRef.children[1].classList.contains("filter-color")) {
    parRef.children[0].classList.toggle("filter-color");
    parRef.children[1].classList.toggle("filter-color");
    sortingTable("referentiel", "asc", listeApprenantForTri);
    buildTemplatePagination(listeApprenantForTri);
    listeApprenantFilter = paginateList(listeApprenantForTri, 1, 5);
    removeListElement();
    buildListApprenants();
    eventForAllApprenants();
    eventLoadPopUpEditApprenants();
  }
});
