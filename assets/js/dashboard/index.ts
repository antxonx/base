import 'bootstrap';
import {showClient} from '@scripts/client/show';

import '@components/simplecard';

const loadEvs = () => {
    [...document.getElementsByClassName("client-list")].forEach(el => el.addEventListener("click", loadClient));
};

const loadClient = (e: Event) => {
    e.preventDefault();
    const ID = +(e.currentTarget as HTMLElement).getAttribute("id")!;
    showClient(ID);
};

loadEvs();
