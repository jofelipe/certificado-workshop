'use client';

import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';
import useSound from 'use-sound';

import './styles.scss';

type Form = {
  name: string;
};

export default function Form() {
  const [form, setForm] = useState<Form>({
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tome] = useSound('/tome.mp3', { volume: 0.25 });
  const [papelao] = useSound('/papelao.mp3');
  const textPreviewRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const names = [
    'Jonathan Felipe',
    'Renan Bonin',
    'Alisson Goulart',
    'Wanderson Silva',
    'Rodolfo Guimarães Ferreira',
    'Pâmella Trevisan',
    'Paola Emily dos Reis',
    'Guilherme Campos',
    'Guilherme da Silva Nunes',
    'Sarah Araujo da Silva',
    'Raquel Campos',
    'Lucas Alves de Souza Marques Timoteo',
    'Leticia Franco',
    'Felipe Gatti',
    'Felipe Ferreira',
    'Leandro Napoli',
    'Rafael Cassita',
    'Daniel Richard',
    'Marcos Eduardo Degrossoli',
    'Jairo Junior',
    'Izauir Guilherme Bernardo dos Santos',
    'Danilo da Silva Porfirio',
    'Mateus José da Silva',
    'Walter Magno',
    'Carlos Batista',
    'Leonardo Moreira',
    'Natalia Maria Secco Souza',
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    if (!names.includes(form.name)) {
      papelao();
      toast.error('Seu nome não está na lista de participantes :(');

      setForm({ ...form, name: '' });

      setIsLoading(false);

      return;
    }

    toast('Seu certificado está sendo gerado :)');

    const link = document.createElement('a');
    link.href = await certificate();
    link.setAttribute('download', 'certificado.png');
    document.body.appendChild(link);
    link.click();

    tome();
    toast.success('Seu certificado foi gerado com sucesso :)');

    setForm({ ...form, name: '' });

    setIsLoading(false);
  };

  const certificate = useCallback(async () => {
    const nameSize = textPreviewRef.current?.clientWidth || 0;

    const response = await fetch(`/api/og?name=${form.name}&size=${nameSize}`);

    const image = await response.arrayBuffer();
    const url = window.URL.createObjectURL(new Blob([image]));

    return url;
  }, [form.name]);

  return (
    <>
      <Toaster theme="dark" position="top-center" />

      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="name">
            Digite seu nome para gerar seu <br />
            certificado de participação:
          </label>
          <div className="input">
            <div className="bg">
              <input
                id="name"
                name="name"
                onChange={handleChange}
                type="text"
                placeholder="Insira seu nome completo"
                autoFocus
                autoComplete="off"
                value={form.name}
                required
              />
              <button type="submit" disabled={isLoading}>
                {isLoading && <span className="loading">Carregando</span>}
                {isLoading ? 'Gerando' : 'Gerar'} certificado
              </button>
            </div>
          </div>
          <span className="text-tip">
            O nome digitado deverá ser o mesmo usado no Microsoft Teams
          </span>
        </fieldset>
      </form>

      <div className="text-preview" ref={textPreviewRef}>
        {form.name}
      </div>
    </>
  );
}
