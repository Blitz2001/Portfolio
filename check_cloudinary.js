// Native fetch used

const cloudName = 'dokj2l4fu';

const files = [
    'Brand_Style_Guide_new_compressed_rhrpby',
    'Brand_Development_Jigsawmena_R2_compressed_y6qcvs',
    'logo_proposal-_concept_3_compressed_nnrvrz',
    'OCRA_-_3_rd_draft_lblcac',
    'Brand_Manual-_BluePrint_Creative_Group_gd09cv'
];

// Check commonly used folder structures to locate the file
const patterns = [];
files.forEach(f => {
    patterns.push(`brand-identity/${f}.pdf`);
    patterns.push(`brand-identity/${f}.jpg`);
    patterns.push(`${f}.pdf`);
    patterns.push(`${f}.jpg`);
});

async function checkUrls() {
    console.log('Checking Cloudinary URLs...');
    for (const path of patterns) {
        const url = `https://res.cloudinary.com/${cloudName}/image/upload/${path}`;
        try {
            const res = await fetch(url, { method: 'HEAD' });
            if (res.ok) {
                console.log(`[FOUND] ${url}`);
            } else {
                console.log(`[${res.status}] ${url}`);
            }
        } catch (e) {
            console.log(`[ERR] ${url} - ${e.message}`);
        }
    }
}

checkUrls();
