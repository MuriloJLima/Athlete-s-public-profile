import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Lista de atletas simulada
const config = {
  urlRoot: "https://api-alunos-kohl.vercel.app", // Substitua pela URL do seu backend
};

export function Home() {

  const [atletas, setAtletas] = useState([]);

  const getAtletas = async () => {
    const response = await axios.get(`${config.urlRoot}/listarAlunos`);
    const sortedData = response.data.data.sort((a, b) => a.dados_matricula.matri_dojo - b.dados_matricula.matri_dojo);
    setAtletas(sortedData);
  };

  useEffect(() => {
    getAtletas();
  }, []);

  return (
    <div>
      <h1>Escolha um atleta</h1>
      <ul>
        {atletas.map((atleta) => (
          <li key={atleta._id}>
            <Link to={`/atleta/${atleta._id}`}>{atleta.dados_aluno.nome_aluno}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
