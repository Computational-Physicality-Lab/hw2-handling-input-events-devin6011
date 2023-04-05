// NOTE: The variable "shirts" is defined in the shirts.js file as the full list of shirt offerings
//       You can access this variable here, and should use this variable here to build your webpages

let initProducts = () => {
    // To see the shirts object, run:
    // console.log(shirts);

    // Your Code Here

    const footer = document.getElementById('footer');

    const productHeading = document.createElement('h2');
    const productHeadingText = document.createTextNode("Our T-Shirts");
    productHeading.className = "page-padded-row";
    productHeading.id = "product-heading";
    productHeading.appendChild(productHeadingText);
    document.body.insertBefore(productHeading, footer);

    const productContainer = document.createElement('div');
    productContainer.id = "product-window-container";
    productContainer.className = "page-padded-row";
    document.body.insertBefore(productContainer, footer);

    // quickview section. not visible initially
    const quickViewContainer = document.createElement('div');
    quickViewContainer.id = "quickview-container";
    quickViewContainer.className = "page-padded-row";
    document.body.insertBefore(quickViewContainer, footer);

    const quickViewImageContainer = document.createElement('div');
    quickViewImageContainer.id = 'quickview-image-container';
    const quickViewImageLinkFront = document.createElement('a');
    const quickViewImageLinkBack = document.createElement('a');
    const quickViewImageFront = document.createElement('img');
    const quickViewImageBack = document.createElement('img');
    quickViewImageLinkFront.href = 'details.html';
    quickViewImageLinkBack.href = 'details.html';
    quickViewImageFront.onerror = () => {
        quickViewImageFront.src = 'shirt_images/not-found.png';
    };
    quickViewImageBack.onerror = () => {
        quickViewImageBack.src = 'shirt_images/not-found.png';
    };
    quickViewImageLinkFront.appendChild(quickViewImageFront);
    quickViewImageLinkBack.appendChild(quickViewImageBack);
    quickViewImageContainer.appendChild(quickViewImageLinkFront);
    quickViewImageContainer.appendChild(quickViewImageLinkBack);
    quickViewContainer.appendChild(quickViewImageContainer);

    const quickViewDetail = document.createElement('div');
    quickViewDetail.id = 'quickview-detail';
    quickViewContainer.appendChild(quickViewDetail);

    const quickViewName = document.createElement('h3');
    const quickViewPrice = document.createElement('h4');
    const quickViewDescription = document.createElement('p');
    const quickViewCloseButton = document.createElement('div');
    quickViewCloseButton.className = 'red-button';
    quickViewCloseButton.onclick = () => {
        quickViewContainer.style.display = 'none';
    }
    const quickViewCloseButtonText = document.createTextNode('Close');
    quickViewCloseButton.appendChild(quickViewCloseButtonText);

    quickViewDetail.appendChild(quickViewName);
    quickViewDetail.appendChild(quickViewPrice);
    quickViewDetail.appendChild(quickViewDescription);
    quickViewDetail.appendChild(quickViewCloseButton);


    for(const [index, shirt] of shirts.entries()) {
        const setShirtID = () => {
            localStorage.setItem('shirtID', index);
        }

        let shirtFrontImage = 'shirt_images/not-found.png';
        let shirtBackImage = 'shirt_images/not-found.png';
        let shirtDisplayImage = 'shirt_images/not-found.png';
        if(shirt.colors && Object.keys(shirt.colors).length) {
            const firstColor = Object.values(shirt.colors)[0];
            shirtFrontImage = firstColor.front || shirtFrontImage;
            shirtBackImage = firstColor.back || shirtBackImage;
            shirtDisplayImage = firstColor.front || firstColor.back || shirtDisplayImage;
        }

        const productWindow = document.createElement('div');
        productContainer.appendChild(productWindow);

        const productImageLink = document.createElement('a');
        const productImage = document.createElement('img');
        productImageLink.href = `details.html`;
        productImageLink.onclick = setShirtID;
        productImage.src = shirtDisplayImage;
        productImage.onerror = () => {
            productImage.src = 'shirt_images/not-found.png';
        };

        productImageLink.appendChild(productImage);
        productWindow.appendChild(productImageLink);

        const productName = document.createElement('h3');
        const productNameText = document.createTextNode(shirt.name || "Name not found");
        productName.appendChild(productNameText);
        productWindow.appendChild(productName);

        const productColorCount = document.createElement('p');
        const colorCount = shirt.colors ? Object.keys(shirt.colors).length : 0;
        const productColorCountText = document.createTextNode(`Available in ${colorCount} color${colorCount > 1 ? 's' : ''}`);
        productColorCount.appendChild(productColorCountText);
        productWindow.appendChild(productColorCount);

        const productButtonContainer = document.createElement('div');
        productWindow.appendChild(productButtonContainer);

        //const quickViewButton = document.createElement('a');
        const quickViewButton = document.createElement('div');
        quickViewButton.className = 'red-button';
        //quickViewButton.href = 'not_implemented.html';
        quickViewButton.onclick = () => {
            quickViewImageLinkFront.onclick = setShirtID;
            quickViewImageLinkBack.onclick = setShirtID;

            quickViewImageFront.src = shirtFrontImage;
            quickViewImageBack.src = shirtBackImage;

            if(quickViewName.hasChildNodes()) {
                quickViewName.removeChild(quickViewName.firstChild);
            }
            const quickViewNameText = document.createTextNode(shirt.name || "Name not found");
            quickViewName.appendChild(quickViewNameText);

            if(quickViewPrice.hasChildNodes()) {
                quickViewPrice.removeChild(quickViewPrice.firstChild);
            }
            const quickViewPriceText = document.createTextNode(shirt.price || "No price available");
            quickViewPrice.appendChild(quickViewPriceText);

            if(quickViewDescription.hasChildNodes()) {
                quickViewDescription.removeChild(quickViewDescription.firstChild);
            }
            const quickViewDescriptionText = document.createTextNode(shirt.description || "No description available");
            quickViewDescription.appendChild(quickViewDescriptionText);

            quickViewContainer.style.display = 'flex';
            quickViewContainer.scrollIntoView({behavior: 'smooth'});
        };
        const quickViewButtonText = document.createTextNode('Quick View');
        quickViewButton.appendChild(quickViewButtonText);
        productButtonContainer.appendChild(quickViewButton);

        const seePageButton = document.createElement('a');
        seePageButton.className = 'red-button';
        seePageButton.href = `details.html`;
        seePageButton.onclick = setShirtID;
        const seePageButtonText = document.createTextNode('See Page');
        seePageButton.appendChild(seePageButtonText);
        productButtonContainer.appendChild(seePageButton);
    }

};

let initDetails = () => {
    // To see the shirts object, run:
    // console.log(shirts);

    // Your Code Here
    const shirtID = localStorage.getItem('shirtID');
    const shirt = shirts[shirtID];

    const colorCount = shirt.colors ? Object.keys(shirt.colors).length : 0;

    let curColor = shirt.colors ? Object.keys(shirt.colors)[0] : undefined;
    let curSide = curColor && shirt.colors && shirt.colors[curColor] && shirt.colors[curColor].front ? 'front' : 'back';

    const footer = document.getElementById('footer');
    
    const detailHeading = document.createElement('h2');
    const detailHeadingText = document.createTextNode(shirt.name || "Name not found");
    detailHeading.className = "page-padded-row";
    detailHeading.id = "detail-heading";
    detailHeading.appendChild(detailHeadingText);
    document.body.insertBefore(detailHeading, footer);

    const detailContainer = document.createElement('div');
    detailContainer.id = 'detail-container';
    detailContainer.className = 'page-padded-row';
    document.body.insertBefore(detailContainer, footer);

    const detailImage = document.createElement('img');
    detailImage.onerror = () => {
        detailImage.src = 'shirt_images/not-found.png';
    };
    detailContainer.appendChild(detailImage);

    const updateImage = () => {
        if(!curColor || !(shirt.colors[curColor]) || !(shirt.colors[curColor][curSide])) {
            detailImage.src = 'shirt_images/not-found.png';
        }
        else {
            detailImage.src = shirt.colors[curColor][curSide];
        }
    }
    updateImage();

    const detailDescriptionContainer = document.createElement('div');
    detailDescriptionContainer.id = 'detail-description-container';
    detailContainer.appendChild(detailDescriptionContainer);

    const detailPrice = document.createElement('h3');
    const detailPriceText = document.createTextNode(shirt.price || "No price available");
    detailPrice.appendChild(detailPriceText);
    detailDescriptionContainer.appendChild(detailPrice);

    const detailDescription = document.createElement('p');
    const detailDescriptionText = document.createTextNode(shirt.description || "No description available");
    detailDescription.appendChild(detailDescriptionText);
    detailDescriptionContainer.appendChild(detailDescription);

    const sideButtonContainer = document.createElement('div');
    detailDescriptionContainer.appendChild(sideButtonContainer);
    
    const sideTextSpan = document.createElement('span');
    const sideText = document.createTextNode('Side:' + (colorCount ? "" : " N/A"));
    sideTextSpan.appendChild(sideText);
    sideButtonContainer.appendChild(sideTextSpan);

    if(colorCount) {
        const frontSideButton = document.createElement('div');
        frontSideButton.className = 'red-button';
        frontSideButton.onclick = () => {
            curSide = 'front';
            updateImage();
        }
        const frontSideButtonText = document.createTextNode('Front');
        frontSideButton.appendChild(frontSideButtonText);
        sideButtonContainer.appendChild(frontSideButton);

        const backSideButton = document.createElement('div');
        backSideButton.className = 'red-button';
        backSideButton.onclick = () => {
            curSide = 'back';
            updateImage();
        }
        const backSideButtonText = document.createTextNode('Back');
        backSideButton.appendChild(backSideButtonText);
        sideButtonContainer.appendChild(backSideButton);
    }

    const colorButtonContainer = document.createElement('div');
    detailDescriptionContainer.appendChild(colorButtonContainer);

    const colorTextSpan = document.createElement('span');
    const colorText = document.createTextNode('Color:' + (colorCount ? "" : " N/A"));
    colorTextSpan.appendChild(colorText);
    colorButtonContainer.appendChild(colorTextSpan);

    for(const color in shirt.colors) {
        const colorButton = document.createElement('div');
        colorButton.className = 'color-button';
        colorButton.style.backgroundColor = color;
        colorButton.onclick = () => {
            curColor = color;
            updateImage();
        }
        const colorButtonText = document.createTextNode(color.charAt(0).toUpperCase() + color.slice(1));
        colorButton.appendChild(colorButtonText);
        colorButtonContainer.appendChild(colorButton);
    }

};
