const notificationsButton = document.querySelector('.menuLinks-notifications ')

// initial state
let currentFilter = 'all';


notificationsButton.addEventListener('click', function() {
    if (notificationsButton.classList.contains('menuLinks-item--active')) {
        const notificationCenter = document.querySelector('.notificationCenter-dropdownWrapper')
        const notificationsHeader = notificationCenter.querySelector('.notificationCenter-header');
        let notificationList = notificationCenter.querySelector('.notificationCenter-list')


        let all;
        let tasks = [];
        let comments = [];

        const checkNotificationList = setInterval(() => {
            if (notificationList) {
                load(notificationList)
                addSelector()
                clearInterval(checkNotificationList);
            }
            notificationList = notificationCenter.querySelector('.notificationCenter-list')
        }, 50);




        function load(notificationList) {
            const notificationItems = notificationList.querySelectorAll('.notificationCenter-listItem')
            let showMoreButton = notificationCenter.querySelector('.notificationCenter-showMoreButton')

            all = notificationItems;

            for (const item of notificationItems) {
                const content = item.querySelector('.notificationCenter-notificationContent').textContent;

                mention = content.match(/(mentioned you)/i);
                comment = content.match(/(commented on)/i);
                reaction = content.match(/(reacted with)/i);
                assign = content.match(/(assigned you)/i);
                remove = content.match(/(removed you)/i);
                move = content.match(/(moved the task)/i);

                if (assign || remove || move) tasks.push(item)
                if (mention || comment || reaction) comments.push(item)
            }


            const checkshowMoreButton = setInterval(() => {
                if (showMoreButton) {
                    showMoreButton.addEventListener('click', function() {
                        setTimeout(() => {
                            load(notificationList)
                        }, 300);
                    })
                    clearInterval(checkshowMoreButton);
                }
                showMoreButton = notificationCenter.querySelector('.notificationCenter-showMoreButton')
            }, 50);

            filter(currentFilter)
        }



        function filter(filterKey) {

            notificationList.innerHTML = '';

            switch (filterKey) {
                case 'tasks':
                    currentFilter = 'tasks'
                    for (const notification of tasks) {
                        notificationList.appendChild(notification);
                    }
                    break;

                case 'comments':
                    currentFilter = 'comments'
                    for (const notification of comments) {
                        notificationList.appendChild(notification);
                    }
                    break;

                default:
                    currentFilter = 'all'
                    for (const notification of all) {
                        notificationList.appendChild(notification);
                    }
                    break;
            }
        }


        function addSelector() {

            const selector = document.createElement('div');
            selector.style.flex = 1
            selector.style.marginLeft = '14px'

            const allSelector = createButton({
                label: 'All',
                callback: () => filter('all')
            })
            allSelector.disabled = true;
            selector.appendChild(allSelector)

            const tasksSelector = createButton({
                label: 'Tasks',
                callback: () => filter('tasks')
            })
            selector.appendChild(tasksSelector)

            const commentsSelector = createButton({
                label: 'Comments',
                callback: () => filter('comments')
            })
            selector.appendChild(commentsSelector)

            notificationsHeader.firstChild.after(selector)



            function createButton({ label, callback }) {
                const button = document.createElement('button');
                button.innerText = label
                button.classList.add('button')
                button.style.margin = '2px'
                button.style.fontSize = '12px'
                button.addEventListener('click', function() {
                    callback()
                    activeThisButton(this)
                })

                return button;
            }


            function activeThisButton(myButton) {
                const buttons = selector.querySelectorAll('button');
                for (const button of buttons) {
                    button.disabled = false;
                }
                myButton.disabled = true;
            }

        }
    }
})
