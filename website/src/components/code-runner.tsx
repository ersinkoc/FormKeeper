import { useEffect, useRef } from 'react'

interface CodeRunnerProps {
  code: string
  onError?: (error: string) => void
  onConsole?: (message: string) => void
}

export function CodeRunner({ code, onError, onConsole }: CodeRunnerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!iframeRef.current) return

    const iframe = iframeRef.current
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDoc) return

    // Create a complete HTML document with FormKeeper and React
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: system-ui, -apple-system, sans-serif;
    }
    * {
      box-sizing: border-box;
    }
  </style>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-type="module">
    const { useState, useEffect, useCallback, useMemo, useRef, useSyncExternalStore } = React;
    const { createRoot } = ReactDOM;

    // FormKeeper implementation
    ${getFormKeeperSource()}

    // User's code
    try {
      ${transformUserCode(code)}

      const root = createRoot(document.getElementById('root'));
      root.render(<App />);

      window.parent.postMessage({ type: 'success', message: 'Code executed successfully' }, '*');
    } catch (error) {
      window.parent.postMessage({
        type: 'error',
        message: error.message,
        stack: error.stack
      }, '*');
    }
  </script>
</body>
</html>
`

    iframeDoc.open()
    iframeDoc.write(html)
    iframeDoc.close()
  }, [code])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'error' && onError) {
        onError(event.data.message)
      } else if (event.data.type === 'console' && onConsole) {
        onConsole(event.data.message)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onError, onConsole])

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0"
      sandbox="allow-scripts"
      title="Code Preview"
    />
  )
}

function transformUserCode(code: string): string {
  // Extract the component from user's code
  // Replace default export with App component
  let transformed = code
    .replace(/import\s+{[^}]+}\s+from\s+['"]@oxog\/formkeeper\/react['"]/g, '')
    .replace(/export\s+default\s+(\w+)/, 'function App() { return <$1 /> }')

  return transformed
}

function getFormKeeperSource(): string {
  // Inline minimal FormKeeper implementation for the sandbox
  return `
    function createEventBus() {
      const listeners = new Map();
      return {
        on(event, callback) {
          if (!listeners.has(event)) listeners.set(event, []);
          listeners.get(event).push(callback);
          return () => {
            const cbs = listeners.get(event);
            if (cbs) listeners.set(event, cbs.filter(cb => cb !== callback));
          };
        },
        emit(event, data) {
          const cbs = listeners.get(event) || [];
          cbs.forEach(cb => cb(data));
        }
      };
    }

    function deepGet(obj, path) {
      return path.split('.').reduce((acc, part) => acc?.[part], obj);
    }

    function deepSet(obj, path, value) {
      const parts = path.split('.');
      const last = parts.pop();
      const target = parts.reduce((acc, part) => {
        if (!(part in acc) || typeof acc[part] !== 'object') {
          acc[part] = {};
        }
        return acc[part];
      }, obj);
      target[last] = value;
      return obj;
    }

    function createForm(options) {
      const eventBus = createEventBus();
      let values = { ...options.initialValues };
      let errors = {};
      let touched = {};
      let isSubmitting = false;
      const fields = new Map();

      const validate = async (name) => {
        const field = fields.get(name);
        if (!field?.rules) return true;

        const value = deepGet(values, name);
        const rules = field.rules;

        if (rules.required) {
          if (!value || (Array.isArray(value) && value.length === 0)) {
            errors[name] = typeof rules.required === 'string' ? rules.required : 'This field is required';
            return false;
          }
        }

        if (rules.pattern && typeof value === 'string') {
          const pattern = rules.pattern.value || rules.pattern;
          if (!pattern.test(value)) {
            errors[name] = rules.pattern.message || 'Invalid format';
            return false;
          }
        }

        if (rules.minLength && typeof value === 'string') {
          const min = rules.minLength.value || rules.minLength;
          if (value.length < min) {
            errors[name] = rules.minLength.message || \`Must be at least \${min} characters\`;
            return false;
          }
        }

        if (rules.min && typeof value === 'number') {
          const min = rules.min.value || rules.min;
          if (value < min) {
            errors[name] = rules.min.message || \`Value must be at least \${min}\`;
            return false;
          }
        }

        if (rules.validate) {
          const result = await rules.validate(value);
          if (result === false || typeof result === 'string') {
            errors[name] = typeof result === 'string' ? result : 'Validation failed';
            return false;
          }
        }

        delete errors[name];
        return true;
      };

      const register = (name, rules) => {
        fields.set(name, { rules });

        return {
          name,
          onChange: (e) => {
            const value = e?.target ?
              (e.target.type === 'checkbox' ? e.target.checked :
               e.target.type === 'number' ? e.target.valueAsNumber :
               e.target.value) : e;

            deepSet(values, name, value);
            touched[name] = true;
            validate(name);
            eventBus.emit('change', { name, value });
          },
          onBlur: () => {
            touched[name] = true;
            validate(name);
            eventBus.emit('blur', { name });
          },
          ref: () => {},
          value: deepGet(values, name) || '',
        };
      };

      const handleSubmit = async (e) => {
        e?.preventDefault?.();
        isSubmitting = true;
        eventBus.emit('change');

        const fieldNames = Array.from(fields.keys());
        const validations = await Promise.all(fieldNames.map(validate));
        const isValid = validations.every(Boolean);

        if (isValid && options.onSubmit) {
          try {
            await options.onSubmit(values);
          } catch (error) {
            console.error('Submit error:', error);
          }
        }

        isSubmitting = false;
        eventBus.emit('change');
      };

      const getValues = () => values;
      const getErrors = () => errors;
      const getTouched = () => touched;
      const getError = (name) => errors[name];
      const isValid = () => Object.keys(errors).length === 0;
      const isDirty = () => Object.keys(touched).length > 0;

      const useFieldArray = (name) => {
        const array = deepGet(values, name) || [];

        return {
          fields: array.map((item, index) => ({ ...item, id: String(index) })),
          append: (item) => {
            const current = deepGet(values, name) || [];
            deepSet(values, name, [...current, item]);
            eventBus.emit('change');
          },
          remove: (index) => {
            const current = deepGet(values, name) || [];
            deepSet(values, name, current.filter((_, i) => i !== index));
            eventBus.emit('change');
          }
        };
      };

      return {
        register,
        handleSubmit,
        getValues,
        getErrors,
        getTouched,
        getError,
        isValid,
        isDirty,
        isSubmitting: () => isSubmitting,
        useFieldArray,
      };
    }

    function useForm(options) {
      const [, forceUpdate] = useState({});
      const formRef = useRef(null);

      if (!formRef.current) {
        formRef.current = createForm(options);
      }

      const form = formRef.current;

      useEffect(() => {
        const unsubscribe = form.register('__internal__', {}).onChange(() => {
          forceUpdate({});
        });
        return unsubscribe;
      }, []);

      return form;
    }
  `;
}
