document.addEventListener('DOMContentLoaded', function () {
    const bookmarkButton = document.getElementById('bookmarkButton');
    const filterInput = document.getElementById('filterInput');
    const labelFilterInput = document.getElementById('labelFilterInput');
    const bookmarkList = document.getElementById('bookmarkList');
  
    bookmarkButton.addEventListener('click', bookmarkCurrentPage);
    // filterInput.addEventListener('input', updateBookmarkList);
    // labelFilterInput.addEventListener('input', updateBookmarkList);
  
    function bookmarkCurrentPage() {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const url = tabs[0].url;
        const title = tabs[0].title;
        chrome.storage.sync.get({ bookmarks: [] }, function (data) {
          const bookmarks = data?.bookmarks || [];
          const existingBookmark = bookmarks.find(b => b.url === url);
          if (existingBookmark) {
            alert('This page is already bookmarked.');
          } else {
            const newBookmark = { url, title, labels: [] };
            bookmarks.push(newBookmark);
            chrome.storage.sync.set({ bookmarks }, updateBookmarkList);
          }
        });
      });
    }
  
    function updateBookmarkList() {
      // const filterText = filterInput.value.toLowerCase();
      // const labelFilterText = labelFilterInput.value.toLowerCase();
      chrome.storage.sync.get({ bookmarks: [] }, function (data) {
        const bookmarks = data?.bookmarks || [];
        bookmarkList.innerHTML = '';
        bookmarks
          // .filter(b => b.title.toLowerCase().includes(filterText) && b.labels.some(label => label.toLowerCase().includes(labelFilterText)))
          .forEach((bookmark, index) => {
            const li = document.createElement('li');
            li.className = 'bookmark';
            li.textContent = `${bookmark.title}`;

            const addLabelButton = document.createElement('button');
            addLabelButton.textContent = '+ Add label';
            addLabelButton.className = 'add-label-button';

            addLabelButton.addEventListener('click', function () {
              labelInput.style.display = 'inline';
              labelInput.focus();
              addLabelButton.style.display = 'none';
            });

            const labelInput = document.createElement('input');
            labelInput.type = 'text';
            labelInput.placeholder = 'Add label';
            labelInput.style.display = 'none';
            
            labelInput.addEventListener('keypress', function (e) {
              if (e.key === 'Enter') {
                  const label = labelInput.value.trim();
                  if (label && !bookmark.labels.includes(label)) {
                      bookmark.labels.push(label);
                      chrome.storage.sync.set({ bookmarks }, updateBookmarkList);
                  }
                  labelInput.value = '';
                  labelInput.style.display = 'none';
                  addLabelButton.style.display = 'inline';
              }
          });
          
          document.addEventListener('click', function (e) {
              if (labelInput.style.display === 'inline' && !labelInput.contains(e.target) && !addLabelButton.contains(e.target)) {
                  labelInput.style.display = 'none';
                  addLabelButton.style.display = 'inline';
              }
          });

          const removeButton = document.createElement('button');
          removeButton.textContent = 'Remove';
          removeButton.className = 'remove-button';
         

          const link = document.createElement('a');
            link.href = bookmark.url;
            link.textContent = `(${bookmark.url})`;
            link.target = '_blank'; // Open link in a new tab


            li.appendChild(link);

            li.appendChild(addLabelButton);
            li.appendChild(labelInput);
            li.appendChild(removeButton);

            removeButton.addEventListener('click', function () {
              bookmarks.splice(index, 1);
              chrome.storage.sync.set({ bookmarks }, updateBookmarkList);
          });

            bookmark.labels.forEach(label => {
              const span = document.createElement('span');
              span.className = 'label';
              span.textContent = label + " ";
              li.appendChild(span);
            });

            bookmarkList.appendChild(li);
          });
      });
    }

    
  
    updateBookmarkList();
  });