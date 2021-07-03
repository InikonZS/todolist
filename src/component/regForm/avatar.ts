import getFormattedImgDataLink from "utilities/imgToDatalink";
import Control from "../../chess/modules/components/control";


export class Avatar extends Control {
  input: HTMLInputElement;
  imgSrc: string;
  constructor(parentNode: HTMLElement){
    super(parentNode,'div','avatar_wrapper');
    this.input = document.createElement('input');
    this.input.type = 'file';
    this.node.appendChild(this.input);
    this.input.onchange = () => {
      if (this.input.files != null) {
        const fileBlob = this.input.files[0];
        getFormattedImgDataLink(200, fileBlob).then((data : string) => {
          const img = new Image();
          img.src = data;
          this.imgSrc = data;
          this.setValue(data)
          img.classList.add('avatar_img');
          this.node.style.backgroundImage = `url(${data})`;
        });
      }
    };
  }
  setValue(data:string){
    this.imgSrc = data
  }
  getValue(){
    return  this.imgSrc
  }
}
