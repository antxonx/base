import 'bootstrap';
import Axios from 'axios';
import Toast from '@scripts/plugins/AlertToast';
import { ROUTES, BIG_LOADER } from '@scripts/app';
import { showClient } from '@scripts/client/show';

const loadEvs = () => {
    [ ...document.getElementsByClassName("client-list") ].forEach(el => el.addEventListener("click", loadClient));
};

const loadClient = (e: Event) => {
    e.preventDefault();
    const ID = +(e.currentTarget as HTMLElement).getAttribute("id")!;
    showClient(ID);
};

loadEvs();