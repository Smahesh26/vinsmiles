const fs = require('fs');
const files = ['index.html', 'treatments.html', 'technology.html', 'our-team.html', 'international.html', 'about.html', 'gallery.html'];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  
  let replaced = content.replace(/(vinsmiles)/gi, (match, p1, offset, string) => {
    let before = string.slice(Math.max(0, offset - 15), offset);
    let after = string.slice(offset + match.length, offset + match.length + 15);
    
    // Skip if it is part of a URL, domain, email, image name, or JS variable
    if (
      after.toLowerCase().startsWith('.com') || 
      after.toLowerCase().startsWith('.png') || 
      after.toLowerCase().startsWith('88') || 
      before.toLowerCase().endsWith('www.') || 
      before.endsWith('/') ||
      before.endsWith('q=') ||
      after.startsWith('_') // like VINSMILES_REVIEWS_ENDPOINT
    ) {
        return match; // return original
    }
    
    // Handle URL encoded parameters specifically (e.g. WhatsApp message text)
    // If it's preceded by %20 or followed by %2C inside a URL context
    if (before.endsWith('%20') || after.startsWith('%2C')) {
       // Is it inside a URL?
       // Let's assume it is and use %20 for the space
       return "VIN%20SMILES";
    }

    return "VIN SMILES";
  });

  if (content !== replaced) {
    fs.writeFileSync(f, replaced);
    console.log('Updated ' + f);
  }
});
