const slugformatter = (slug) => {
   const array = [" ", "!", "\"", "#", "$", "%", "&", "/", "(", ")", "?", "*", "+", "-", ".", ",", ";", ":", "_", " ", "--", "---", "----", "-----", "=", "'", "-", "’s", "'s"]
   array.forEach((ele)=>{
     slug = slug.replaceAll(ele," ")
   })   
    slug = slug.toLowerCase();
    slug = slug.trim()
    slug = slug.replace(/\s+/g, "-");
    
    return slug;
}

module.exports = slugformatter