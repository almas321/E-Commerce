const imagePickerElement = document.querySelector('.image-upload-control input'); //image picker button 
const imagePreviewElement = document.querySelector('.image-upload-control img');

//Now in that function, we can now extract an array of all the files that have been picked, since theoretically, you could configure the input elements such that you can select multiple images, though that's not what we support in this website here, but we can get a list of all the files that have been selected

function updateImagePreview() {
  const files = imagePickerElement.files;

  if (!files || files.length === 0)  // if files is maybe not truthy, if it's falsey, or if no image has been picked.
   {
    imagePreviewElement.style.display = 'none';
    return;
  }

  const pickedFile = files[0];

  //We can create such a URL with the built-in URL class, so that's a class built into front-end JavaScript. And on that class, we've got a static method called create object URL.Since it's static, we don't have to instantiate the class. We can just call this static method on the class,
  
  imagePreviewElement.src = URL.createObjectURL(pickedFile); //This will generate a URL that will work on the computer of our visitor who picked that file
  imagePreviewElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreview);
