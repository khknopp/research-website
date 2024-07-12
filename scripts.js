document.addEventListener("DOMContentLoaded", function() {
    const bibtexData = `
        @article{hofmeyer2002combined,
            title={Combined web crippling and bending moment failure of first-generation trapezoidal steel sheeting},
            author={Hofmeyer, Herm and Kerstens, JGM and Snijder, HH and Bakker, MCM},
            journal={Journal of Constructional Steel Research},
            volume={58},
            number={12},
            pages={1509--1529},
            year={2002},
            publisher={Elsevier},
            abstract={This paper presents a combined web crippling and bending moment failure analysis...},
            note={Important study on structural failure},
            link={https://doi.org/10.1016/S0143-974X(02)00085-6}
        }

        @article{hofmeyer2015coevolutionary,
            title={Coevolutionary and genetic algorithm based building spatial and structural design},
            author={Hofmeyer, Herm and Delgado, Juan Manuel Davila},
            journal={AI EDAM},
            volume={29},
            number={4},
            pages={351--370},
            year={2015},
            publisher={Cambridge University Press},
            abstract={This study explores the integration of coevolutionary algorithms...},
            note={Key insights into building design algorithms},
            link={https://doi.org/10.1017/S0890060415000095}
        }

        @article{hofmeyer2022direct,
            title={The Direct Strength Method for first generation trapezoidal steel sheeting under Interior One Flange and Interior Two Flange web crippling},
            author={Hofmeyer, Herm and Geers, SWA and Snijder, HH and Schafer, BW},
            journal={Thin-Walled Structures},
            volume={180},
            pages={109795},
            year={2022},
            publisher={Elsevier},
            abstract={The Direct Strength Method is applied to first generation trapezoidal steel sheeting...},
            note={Advances in the strength method application},
            link={https://doi.org/10.1016/j.tws.2022.109795}
        }

        @phdthesis{examplephd,
            author={Smith, John},
            title={PhD Title},
            school={Eindhoven University of Technology},
            year={2024},
            abstract={This thesis investigates adaptive methods...},
            note={PhD Thesis},
            key={examplephd}
        }

        @mastersthesis{jones2024efficient,
            author={Jones, Emily},
            title={Efficient Algorithms for Large-Scale Data Processing},
            school={University of Technology},
            year={2024},
            abstract={This thesis explores efficient algorithms for processing large-scale datasets...},
            note={Master's Thesis},
            key={jones2024efficient}
        }

        @inproceedings{hofmeyer2015coevolutionary,
            title={Coevolutionary and genetic algorithm based building spatial and structural design},
            author={Hofmeyer, Herm and Delgado, Juan Manuel Davila},
            journal={AI EDAM},
            volume={29},
            number={4},
            pages={351--370},
            year={2015},
            publisher={Cambridge University Press},
            abstract={This study explores the integration of coevolutionary algorithms...},
            note={Key insights into building design algorithms},
            link={https://doi.org/10.1017/S0890060415000095}
        }
    `;

    let articles = [];

    function parseBibtex(bibtex) {
        const entries = bibtex.trim().split(/\n\s*@/).slice(1);
        const parsedArticles = entries.map(entry => {
            entry = '@' + entry.trim();  // Add @ back for consistent formatting
            const [, type, body] = entry.match(/@(\w+)\{([^]+)\}/) || [];
            if (!type || !body) {
                return null;
            }
            const fields = body.split(',\n').reduce((acc, field) => {
                const [key, value] = field.split('=').map(str => str.trim().replace(/[{}"]/g, ''));
                if (key && value) {
                    acc[key] = value;
                }
                return acc;
            }, {});
            fields.key = entry.match(/@(\w+)\{([^,]+),/)[2]; // Extract key
            return { type, ...fields };
        }).filter(article => article !== null);
        return parsedArticles;
    }

    function createPersonTile(name) {
        const lastName = name.split(',')[0].trim().split(' ').pop();  // Extract last name
        const col = document.createElement('div');
        col.className = 'col-md-3 col-sm-6';
        col.innerHTML = `
            <div class="tile" onclick="showToastAndFilterArticles('${name}')">
                <img src="images/person_${lastName}.jpg" alt="${name}" class="img-fluid">
                <h3>${name}</h3>
            </div>
        `;
        return col;
    }

    function createPhDThesisTile(thesis) {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6';
        col.innerHTML = `
            <div class="tile" onclick="showThesisModal('${thesis.key}')">
                <img src="images/phdthesis_${thesis.key}.jpg" alt="${thesis.title}" class="img-fluid">
                <h3>${thesis.title}</h3>
                <p>${thesis.author} (${thesis.year})</p>
            </div>
        `;
        return col;
    }

    function createMScThesisTile(thesis) {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6';
        col.innerHTML = `
            <div class="tile" onclick="showThesisModal('${thesis.key}')">
                <img src="images/mastersthesis_${thesis.key}.jpg" alt="${thesis.title}" class="img-fluid">
                <h3>${thesis.title}</h3>
                <p>${thesis.author} (${thesis.year})</p>
            </div>
        `;
        return col;
    }

    function createConferenceThesisTile(thesis) {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6';
        col.innerHTML = `
            <div class="tile" onclick="showThesisModal('${thesis.key}')">
                <img src="images/inproceedings_${thesis.key}.jpg" alt="${thesis.title}" class="img-fluid">
                <h3>${thesis.title}</h3>
                <p>${thesis.author} (${thesis.year})</p>
            </div>
        `;
        return col;
    }

    function createArticleTile(article) {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6';
        col.innerHTML = `
            <div class="tile" onclick="showArticleModal('${article.key}')">
                <img src="images/article_${article.key}.jpg" alt="${article.title}" class="img-fluid">
                <h3>${article.title}</h3>
                <p>${article.author} (${article.year})</p>
            </div>
        `;
        return col;
    }

    function populatePeople(articles) {
        const peopleSet = new Set();
        articles.forEach(article => {
            const authors = article.author.split(' and ');
            authors.forEach(author => peopleSet.add(author.trim()));
        });
        const peopleSection = document.getElementById('people').querySelector('.row');
        peopleSet.forEach(name => {
            const personTile = createPersonTile(name);
            peopleSection.appendChild(personTile);
        });
    }

    function populatePhDTheses(articles) {
        const thesesSet = new Set(articles.filter(article => article.type === 'phdthesis').map(article => ({ key: article.key, title: article.title, description: article.note, author: article.author, year: article.year || '' })));
        const thesesSection = document.getElementById('theses').querySelector('.row');
        thesesSection.innerHTML = ''; // Clear previous article
        thesesSet.forEach(thesis => {
            const thesisTile = createPhDThesisTile(thesis);
            thesesSection.appendChild(thesisTile);
        });
    }

    function populateMScTheses(articles) {
        const thesesSet = new Set(articles.filter(article => article.type === 'mastersthesis').map(article => ({ key: article.key, title: article.title, description: article.note, author: article.author, year: article.year || '' })));
        const thesesSection = document.getElementById('msctheses').querySelector('.row');
        thesesSection.innerHTML = ''; // Clear previous article
        thesesSet.forEach(thesis => {
            const thesisTile = createMScThesisTile(thesis);
            thesesSection.appendChild(thesisTile);
        });
    }
    

    function populateArticles(articles) {
        only_articles = articles.filter(article => article.type === 'article');
        const articleSection = document.getElementById('articles').querySelector('.row');
        articleSection.innerHTML = ''; // Clear previous articles
        only_articles.forEach(article => {
            const articleTile = createArticleTile(article);
            articleSection.appendChild(articleTile);
        });
    }

    function populateConferences(articles) {
        const conferenceSet = new Set(articles.filter(article => article.type === 'inproceedings').map(article => ({ key: article.key, title: article.title, description: article.note, author: article.author, year: article.year || '' })));
        const conferenceSection = document.getElementById('conferences').querySelector('.row');
        conferenceSection.innerHTML = ''; // Clear previous article
        conferenceSet.forEach(thesis => {
            const conferenceTile = createConferenceThesisTile(thesis);
            conferenceSection.appendChild(conferenceTile);
        });
    }

    function init() {
        articles = parseBibtex(bibtexData);
        populatePeople(articles);
        populatePhDTheses(articles);
        populateMScTheses(articles);
        populateArticles(articles);
        populateConferences(articles);
    }

    init();

    window.showToastAndFilterArticles = function(author) {
        const toastHTML = `
            <div class="toast">
                <div class="toast-header">
                    <strong class="mr-auto">Currently selected for: ${author}</strong>
                </div>
                <div class="toast-body">
                    View this author's work below or click 'Reset' to view all positions.<br/><br/>
                    <button class="btn btn-secondary mb-3" onclick="resetArticles();" data-dismiss="toast">Reset</button>
                </div>
            </div>
        `;
        const toastContainer = document.getElementById('toastContainer');
        toastContainer.innerHTML = toastHTML;
        $('.toast').toast({ autohide: false });
        $('.toast').toast('show');
        filterArticles(author);
    };

    window.filterArticles = function(author) {
        const filteredArticles = articles.filter(article => article.author.includes(author));
        populateArticles(filteredArticles);

        const filteredPhds = articles.filter(article => article.type === 'phdthesis' && article.author.includes(author));
        populatePhDTheses(filteredPhds);

        const filteredMSc = articles.filter(article => article.type === 'mastersthesis' && article.author.includes(author));
        populateMScTheses(filteredMSc);

        const filteredConferences = articles.filter(article => article.type === 'inproceedings' && article.author.includes(author));
        populateConferences(filteredConferences);

        document.getElementById('resetButton').style.display = 'block';
    };

    window.resetArticles = function() {
        populateArticles(articles);
        populateMScTheses(articles);
        populatePhDTheses(articles);
        populateConferences(articles);
        document.getElementById('resetButton').style.display = 'none';
    };

    window.showThesisModal = function(thesisKey) {
        const thesis = articles.find(a => a.key === thesisKey);
        const authors = thesis.author.split(' and ').map(author => `<a href="javascript:showToastAndFilterArticles('${author.trim()}')">${author.trim()}</a>`).join(', ');

        $('#thesisModalLabel').text(thesis.title);
        $('#thesisModalDesc').html(`
            <p><strong>Author:</strong> ${authors}</p>
            <p><strong>Year:</strong> ${thesis.year}</p>
            <p><strong>Abstract:</strong> ${thesis.abstract || 'No abstract available.'}</p>
            <p><strong>Note:</strong> ${thesis.note || 'No additional notes.'}</p>
            <p><strong>Link:</strong> <a href="${thesis.link}" target="_blank">${thesis.link}</a></p>
        `);
        $('#thesisModal').modal('show');
    };

    window.showArticleModal = function(articleKey) {
        const article = articles.find(a => a.key === articleKey);
        const authors = article.author.split(' and ').map(author => `<a href="javascript:showToastAndFilterArticles('${author.trim()}')">${author.trim()}</a>`).join(', ');

        $('#articleModalLabel').text(article.title);
        $('#articleModalDesc').html(`
            <p><strong>Authors:</strong> ${authors}</p>
            <p><strong>Journal:</strong> ${article.journal}</p>
            <p><strong>Year:</strong> ${article.year}</p>
            <p><strong>Volume:</strong> ${article.volume}</p>
            <p><strong>Pages:</strong> ${article.pages}</p>
            <p><strong>Abstract:</strong> ${article.abstract || 'No abstract available.'}</p>
            <p><strong>Note:</strong> ${article.note || 'No additional notes.'}</p>
            <p><strong>Link:</strong> <a href="${article.link}" target="_blank">${article.link}</a></p>
        `);
        $('#articleModal').modal('show');
    };
});