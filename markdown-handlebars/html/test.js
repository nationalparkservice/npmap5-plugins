const textArea = document.getElementById('textarea');
const outputDiv = document.getElementById('output');
const errorDiv = document.getElementById('errors');

const rerender = () => {
  errorDiv.innerHTML = '';
  try { json = JSON.parse(jsonarea.value) } catch (e) { }
  const div = markdownHandlebars.templater(textArea.value, {
    properties: json,
    geometry: {
      type: "Feature",
      geometry: {
        type: 'Point',
        coordinates: [0, 1]
      },
      properties: json
    }
  });
  outputDiv.innerHTML = '';
  outputDiv.appendChild(div);
}

const markdownHandlebars = new window.Npmap5MarkdownHandlebars({
  errorHandler: (exp) => { errorDiv.innerText = exp; console.log(exp) }
});

textArea.addEventListener('input', rerender);
jsonarea.addEventListener('input', rerender);

let json = {};