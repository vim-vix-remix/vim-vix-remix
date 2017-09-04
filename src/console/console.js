import './console.scss';
import * as messages from '../shared/messages';

const parent = window.parent;

// TODO consider object-oriented
var prevValue = "";

const blurMessage = () => {
  return {
    type: 'vimvixen.command.blur'
  };
};

const keydownMessage = (input) => {
  return {
    type: 'vimvixen.command.enter',
    value: input.value
  };
};

const keyupMessage = (input) => {
  return {
    type: 'vimvixen.command.change',
    value: input.value
  };
};

const handleBlur = () => {
  messages.send(parent, blurMessage());
};

const handleKeydown = (e) => {
  switch(e.keyCode) {
  case KeyboardEvent.DOM_VK_ESCAPE:
    messages.send(parent, blurMessage());
    break;
  case KeyboardEvent.DOM_VK_RETURN:
    messages.send(parent, keydownMessage(e.target));
    break;
  }
};

const handleKeyup = (e) => {
  if (e.target.value === prevValue) {
    return;
  }
  messages.send(parent, keyupMessage(e.target));
  prevValue = e.target.value;
};

window.addEventListener('load', () => {
  let input = window.document.querySelector('#vimvixen-console-command-input');
  input.addEventListener('blur', handleBlur);
  input.addEventListener('keydown', handleKeydown);
  input.addEventListener('keyup', handleKeyup);
});

const showCommand = (text) => {
  let command = window.document.querySelector('#vimvixen-console-command');
  command.style.display = 'block';

  let error = window.document.querySelector('#vimvixen-console-error');
  error.style.display = 'none';

  let input = window.document.querySelector('#vimvixen-console-command-input');
  input.value = text;
  input.focus();
}

const showError = (text) => {
  let error = window.document.querySelector('#vimvixen-console-error');
  error.textContent = text;
  error.style.display = 'block';

  let command = window.document.querySelector('#vimvixen-console-command');
  command.style.display = 'none';

  let completion  = window.document.querySelector('#vimvixen-console-completion');
  command.style.display = 'none';
}

const setCompletions = (completions) => {
  let completion  = window.document.querySelector('#vimvixen-console-completion');
  completion.style.display = 'block';
  completion.innerHTML = '';

  for (let group of completions) {
    let title = window.document.createElement('li');
    title.className = 'vimvixen-console-completion-title';
    title.textContent = group.name;

    completion.append(title);

    for (let item of group.items) {
      let caption = window.document.createElement('span');
      caption.textContent = item.caption;
      caption.className = 'vimvixen-console-completion-item-caption';

      let url = window.document.createElement('span');
      url.textContent = item.url;
      url.className = 'vimvixen-console-completion-item-url';

      let li = window.document.createElement('li');
      li.style.backgroundImage = 'url(' + item.icon + ')';
      li.className = 'vimvixen-console-completion-item';
      li.append(caption);
      li.append(url);
      li.setAttribute('data-content', item.content);

      completion.append(li);
    }
  }
}

messages.receive(window, (message) => {
  switch (message.type) {
  case 'vimvixen.console.show.command':
    showCommand(message.text);
    break;
  case 'vimvixen.console.show.error':
    showError(message.text);
    break;
  case 'vimvixen.console.set.completions':
    setCompletions(message.completions);
    break;
  }
});
