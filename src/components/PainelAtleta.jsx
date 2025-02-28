import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./PainelAtleta.module.css";
import noProfile from '../assets/noProfile.jpg';
import { Avatar } from "./Avatar";

const config = {
  urlRoot: "https://api-alunos-kohl.vercel.app", // Substitua pela URL do seu backend
};

export const PainelAtleta = () => {
  const { id } = useParams(); // Captura o ID da URL
  const [atleta, setAtleta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [idade, setIdade] = useState(null);

  useEffect(() => {
    const fetchAtleta = async () => {
      try {
        const response = await axios.get(`${config.urlRoot}/dadosAluno`, {
          params: { id },
        });

        setAtleta(response.data.data);

        console.log(response.data.data)
      } catch (error) {
        setErro("Erro ao buscar os dados.");
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    fetchAtleta();
  }, [id]);

  useEffect(() => {
    if (atleta?.dados_aluno?.nasc_aluno) {
      const birthDate = new Date(atleta?.dados_aluno?.nasc_aluno);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      setIdade(age);
    }
  }, [atleta]);

  const obterUltimaGraduacao = (gradList) => {
    return gradList.length > 0 ? gradList[gradList.length - 1].graduacao : 'Sem graduação';
  };

  const karateGrad = atleta?.dados_matricula?.dados_modalidades.dados_karate.grad_aluno;

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (erro) return <p className={styles.erro}>{erro}</p>;

  return (
    <div className={styles.container}>
        <div className={styles.painel}>
            {/* Avatar e Nome */}
            <div className={styles.topSection}>
                <Avatar src={atleta?.image_url || noProfile} />
                <h2 className={styles.nome}>{atleta.dados_aluno.nome_aluno}</h2>
                {atleta?.dados_matricula?.matri_dojo == "0001" ? (
                  <span className={styles.matricula}>Instrutor - Nº {atleta?.dados_matricula?.matri_dojo || "000"}</span>
                ): (
                  <span className={styles.matricula}>Atleta - Nº {atleta?.dados_matricula?.matri_dojo || "000"}</span>
                )}
               
            </div>

            {/* Informações Básicas */}
            <div className={styles.infoSection}>
                <div className={styles.infoGroup}>
                    <label>Idade:</label>
                    <span>{idade !== null ? `${idade} anos` : "--"}</span>
                </div>
                <div className={styles.infoGroup}>
                    <label>Tipo Sanguíneo:</label>
                    <span>{atleta?.dados_aluno?.t_sanguineo || "--"}</span>
                </div>
                {idade !== null && idade < 18 ? (
             
             <>
               <div className={styles.infoGroup}>
                 <label>Nome do Responsável:</label>
                 <span>{atleta?.dados_respons?.nome_respons || "--"}</span>
               </div>

               <div className={styles.infoGroup}>
                 <label>Telefone:</label>
                 <span>{atleta?.dados_respons?.tel_respons || "--"}</span>
               </div>
             </>
          
         ) : (
           <div className={styles.infoGroup}>
             <label>Telefone:</label>
             <span>{atleta?.dados_aluno?.tel_aluno || "--"}</span>
           </div>
         )}
            </div>

            {/* Graduação e Histórico de Competições */}
            {atleta?.dados_matricula?.dados_modalidades.dados_karate.is_aluno && (
                <div className={styles.gradSection}>
                    <h3>Graduação</h3>
                    <p>{obterUltimaGraduacao(karateGrad) || "Sem graduação"}</p>

                    {atleta.dados_matricula.dados_modalidades.dados_karate.competicoes.length > 0 && (
                        <div className={styles.competitions}>
                            <h3>Histórico de Competições</h3>
                            {atleta.dados_matricula.dados_modalidades.dados_karate.competicoes
                                .sort((a, b) => {
                                    const ordem = ['Mundial', 'Internacional', 'Nacional', 'Estadual', 'Regional', 'Municipal'];
                                    return ordem.indexOf(a.nivel) - ordem.indexOf(b.nivel);
                                })
                                .map((comp, index) => (
                                    <p key={index}>
                                        {comp.colocacao} - {comp.nivel} ({comp.localidade}, {comp.ano}) - {comp.disputa}
                                    </p>
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
);


};
