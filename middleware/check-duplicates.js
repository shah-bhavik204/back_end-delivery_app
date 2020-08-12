exports.duplicates = ((arr,field1,field2) => {
    arr.forEach((obj,i) => {
        if(arr[i].product_id === arr[i+1].product_id && arr[i].title === arr[i+1].title) {
          return true
        }
      })
    return false
})