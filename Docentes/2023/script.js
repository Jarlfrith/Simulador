var bienios = document.getElementById("bienios");
bienios.addEventListener("input", function () {
  var numero = bienios.value;
  if (numero.charAt(0) === "0" && numero.length > 1) {
    bienios.value = numero.substring(1);
  }

  if (bienios.value > 15) {
    bienios.value = 15;
  }
  if (bienios.value < 0) {
    bienios.value = "";
  }
});

var horas_contrato = document.getElementById("horas-contrato");
horas_contrato.addEventListener("input", function () {
  if (horas_contrato.value > 44) {
    horas_contrato.value = 44;
  }
  if (horas_contrato.value < 1) {
    horas_contrato.value = "";
  }
});

var dias_trabajados = document.getElementById("dias-trabajados");
dias_trabajados.addEventListener("input", function () {
  if (dias_trabajados.value > 30) {
    dias_trabajados.value = 30;
  }
  if (dias_trabajados.value < 1) {
    dias_trabajados.value = "";
  }
});

const imprimir = document.getElementById("imprimir-btn");
imprimir.addEventListener("click", function () {
  window.print();
});

const modificar = document.getElementById("modificar-btn");
modificar.addEventListener("click", function () {
  //Deshabilita campos
  document.getElementById("tramo").disabled = false;
  document.getElementById("nivel").disabled = false;
  document.getElementById("bienios").disabled = false;
  document.getElementById("horas-contrato").disabled = false;
  document.getElementById("dias-trabajados").disabled = false;
  document.getElementById("brp-titulo").disabled = false;
  document.getElementById("brp-mencion").disabled = false;
  document.getElementById("isla-robinson-crusoe").disabled = false;
  document.getElementById("alumnos-prioritarios").disabled = false;
  document.getElementById("rural").disabled = false;
  modificar.style.display = "none";
  imprimir.style.display = "none";
  document.getElementById("mensaje").style.display = "none";
  document.getElementById("calcular-btn").style.display = "block";

  //Borra datos de tabla
  tb_rbmn.cells[1].textContent = "";
  tb_rbmn.cells[2].textContent = "";
  tb_experiencia.cells[1].textContent = "";
  tb_experiencia.cells[2].textContent = "";
  tb_brp_titulo.cells[1].textContent = "";
  tb_brp_titulo.cells[2].textContent = "";
  tb_brp_mencion.cells[1].textContent = "";
  tb_brp_mencion.cells[2].textContent = "";
  tb_asig_tramo.cells[1].textContent = "";
  tb_asig_tramo.cells[2].textContent = "";
  tb_asig_alta.cells[1].textContent = "";
  tb_asig_alta.cells[2].textContent = "";
  tb_zona.cells[1].textContent = "";
  tb_zona.cells[2].textContent = "";
  tb_total.cells[1].textContent = "";
  tb_total.cells[2].textContent = "";
  tb_liquido.cells[1].textContent = "";
  tb_liquido.cells[2].textContent = "";
});

document.getElementById("calcular-btn").addEventListener("click", function () {
  // 1. Obtener valores del formulario
  var tramo = document.getElementById("tramo").value;
  var nivel = document.getElementById("nivel").value;
  var bienios = document.getElementById("bienios").value;
  var horasContrato = document.getElementById("horas-contrato").value;
  var diasTrabajados = document.getElementById("dias-trabajados").value;
  var brpTitulo = document.getElementById("brp-titulo").value;
  var brpMencion = document.getElementById("brp-mencion").value;
  var islaRobinsonCrusoe = document.getElementById(
    "isla-robinson-crusoe"
  ).value;
  var alumnosPrioritarios = document.getElementById(
    "alumnos-prioritarios"
  ).value;
  var rural = document.getElementById("rural").value;

  // Validar que todos los campos estén completos
  if (
    tramo === "" ||
    nivel === "" ||
    bienios === "" ||
    horasContrato === "" ||
    diasTrabajados === "" ||
    brpTitulo === "" ||
    brpMencion === "" ||
    islaRobinsonCrusoe === "" ||
    alumnosPrioritarios === "" ||
    rural === ""
  ) {
    alert(" FAVOR COMPLETAR TODOS LOS CAMPOS DEL FORMULARIO");
  } else {
    // 2. Generar la llave
    var con_key = tramo + "-" + bienios + "-" + horasContrato + "-" + nivel;
    // Convertir con_key al formato "Primera Letra Mayúscula"
    con_key = con_key
      .toLowerCase()
      .split("-")
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join("-");

    // 3. Leer el archivo JSON
    fetch("docentes_2023.json")
      .then((response) => response.json())
      .then((data) => {
        // 4. Buscar la coincidencia en el JSON
        var datosSimulacion = data.find(
          (item) => item["Id Validador"] === con_key
        );

        if (datosSimulacion) {
          // 5. Extraer los datos del JSON
          var rbmn = parseFloat(datosSimulacion.RBMN);
          var experiencia = parseFloat(
            datosSimulacion["Experiencia (Bienios)"]
          );
          var brp_titulo =
            brpTitulo === "SI"
              ? parseFloat(datosSimulacion["BRP Título"])
              : 0;
          var brp_mencion =
            brpMencion === "SI"
              ? parseFloat(datosSimulacion["BRP Mención"])
              : 0;
          var asignacion = parseFloat(
            datosSimulacion["Asignación de Tramo"]
          );

// ... (código de la Parte 1) ...

          // 6. Realizar los cálculos (manteniendo la lógica original)
          var contenido = "DIAS TRABAJADOS";
          var apo_liqu = Number(0.83);
          var apo_zona = Number(0.7);
          var apo_mes = Number(30);
          var apo_max_hrs = Number(44);
          var apo_opc_1 = Number(0.1); // Art. 50 del DFL n° 1, de 1996, del ministerio de Educación, modificado por el art. 1 n° 33 de la Ley 20903.
          var apo_opc_2 = Number(0.2); // Art. 50 del DFL n° 1, de 1996, del ministerio de Educación, modificado por el art. 1 n° 33 de la Ley 20903.
          var apo_mnt_b16 = Number(58145); // Corresponde a Mto Fijo ACAP
          var apo_mnt_b17 = Number(137932); // Corresponde a Mto Fijo ACAP - Avanzado|Exp 1|Exp 2
          var resul_brp_tit; // Variable para comparar brp titulo
          var resul_brp_men; // Variable para comparar brp mencion
          var resul_prioritario; // Variable para comparar asig. prioritario
          var resul_brp_zona; // Variable para comparar zona

          var vlr_rbmn_1 = Math.round(Number(rbmn));
          var vlr_rbmn_2 = Math.round(
            Number((vlr_rbmn_1 / apo_mes) * diasTrabajados)
          );
          var vlr_experiencia_1 = Math.round(Number(experiencia));
          var vlr_experiencia_2 = Math.round(
            Number((vlr_experiencia_1 / apo_mes) * diasTrabajados)
          );

          if (brpTitulo == "NO") {
            resul_brp_tit = 0;
          } else {
            resul_brp_tit = brp_titulo;
          }
          var vlr_brp_titulo_1 = Math.round(Number(resul_brp_tit));
          var vlr_brp_titulo_2 = Math.round(
            Number((vlr_brp_titulo_1 / apo_mes) * diasTrabajados)
          );
          if (brpMencion == "NO") {
            resul_brp_men = 0;
          } else {
            resul_brp_men = brp_mencion;
          }
          var vlr_brp_mencion_1 = Math.round(Number(resul_brp_men));
          var vlr_brp_mencion_2 = Math.round(
            Number((vlr_brp_mencion_1 / apo_mes) * diasTrabajados)
          );
          var vlr_asignacion_1 = Math.round(Number(asignacion));
          var vlr_asignacion_2 = Math.round(
            Number((vlr_asignacion_1 / apo_mes) * diasTrabajados)
          );
          if (alumnosPrioritarios === ">60") {
            resul_prioritario =
              apo_opc_2 * vlr_asignacion_1 +
              (apo_mnt_b16 * horasContrato) / apo_max_hrs;
          } else if (
            alumnosPrioritarios === ">80" &&
            (tramo === "AVANZADO" ||
              tramo === "EXPERTO 1" ||
              tramo === "EXPERTO 2")
          ) {
            resul_prioritario =
              apo_opc_2 * vlr_asignacion_1 +
              (apo_mnt_b17 * horasContrato) / apo_max_hrs;
          } else if (
            alumnosPrioritarios === ">80" &&
            (tramo === "INICIAL" || tramo === "TEMPRANO")
          ) {
            resul_prioritario =
              apo_opc_2 * vlr_asignacion_1 +
              (apo_mnt_b16 * horasContrato) / apo_max_hrs;
          } else if (
            rural === "SI" &&
            alumnosPrioritarios === "<60 y >45"
          ) {
            resul_prioritario = apo_opc_1 * vlr_asignacion_1;
          } else {
            resul_prioritario = 0;
          }
          var vlr_prioritario_1 = Math.round(Number(resul_prioritario));
          var vlr_prioritario_2 = Math.round(
            Number((vlr_prioritario_1 / apo_mes) * diasTrabajados)
          );
          if (islaRobinsonCrusoe == "NO") {
            resul_brp_zona = 0;
          } else {
            resul_brp_zona = vlr_rbmn_1 * apo_zona;
          }
          var vlr_zona_1 = Math.round(Number(resul_brp_zona));
          var vlr_zona_2 = Math.round(
            Number((vlr_zona_1 / apo_mes) * diasTrabajados)
          );
          var vlr_total_1 = Math.round(
            Number(
              vlr_rbmn_1 +
                vlr_experiencia_1 +
                vlr_brp_titulo_1 +
                vlr_brp_mencion_1 +
                vlr_asignacion_1 +
                vlr_prioritario_1 +
                vlr_zona_1
            )
          );
          var vlr_total_2 = Math.round(
            Number(
              vlr_rbmn_2 +
                vlr_experiencia_2 +
                vlr_brp_titulo_2 +
                vlr_brp_mencion_2 +
                vlr_asignacion_2 +
                vlr_prioritario_2 +
                vlr_zona_2
            )
          );
          var vlr_liquido_1 = Math.round(Number(vlr_total_1 * apo_liqu));
          var vlr_liquido_2 = Math.round(Number(vlr_total_2 * apo_liqu));

          // 7. Mostrar los resultados en la tabla (manteniendo el formato)
          var tb_rbmn = document.getElementById("tb_rbmn");
          var tb_experiencia = document.getElementById("tb_experiencia");
          var tb_brp_titulo = document.getElementById("tb_brp_titulo");
          var tb_brp_mencion = document.getElementById("tb_brp_mencion");
          var tb_asig_tramo = document.getElementById("tb_asig_tramo");
          var tb_asig_alta = document.getElementById("tb_asig_alta");
          var tb_zona = document.getElementById("tb_zona");
          var tb_total = document.getElementById("tb_total");
          var tb_liquido = document.getElementById("tb_liquido");

          tb_rbmn.cells[1].textContent = "$ " + vlr_rbmn_1.toLocaleString();
          tb_rbmn.cells[2].textContent = "$ " + vlr_rbmn_2.toLocaleString();
          tb_experiencia.cells[1].textContent =
            "$ " + vlr_experiencia_1.toLocaleString();
          tb_experiencia.cells[2].textContent =
            "$ " + vlr_experiencia_2.toLocaleString();
          tb_brp_titulo.cells[1].textContent =
            "$ " + vlr_brp_titulo_1.toLocaleString();
          tb_brp_titulo.cells[2].textContent =
            "$ " + vlr_brp_titulo_2.toLocaleString();
          tb_brp_mencion.cells[1].textContent =
            "$ " + vlr_brp_mencion_1.toLocaleString();
          tb_brp_mencion.cells[2].textContent =
            "$ " + vlr_brp_mencion_2.toLocaleString();
          tb_asig_tramo.cells[1].textContent =
            "$ " + vlr_asignacion_1.toLocaleString();
          tb_asig_tramo.cells[2].textContent =
            "$ " + vlr_asignacion_2.toLocaleString();
          tb_asig_alta.cells[1].textContent =
            "$ " + vlr_prioritario_1.toLocaleString();
          tb_asig_alta.cells[2].textContent =
            "$ " + vlr_prioritario_2.toLocaleString();
          tb_zona.cells[1].textContent =
            "$ " + vlr_zona_1.toLocaleString();
          tb_zona.cells[2].textContent =
            "$ " + vlr_zona_2.toLocaleString();
          tb_total.cells[1].textContent =
            "$ " + vlr_total_1.toLocaleString();
          tb_total.cells[2].textContent =
            "$ " + vlr_total_2.toLocaleString();
          tb_liquido.cells[1].textContent =
            "$ " + vlr_liquido_1.toLocaleString();
          tb_liquido.cells[2].textContent =
            "$ " + vlr_liquido_2.toLocaleString();

          // Dinamico Titulo tabla días
          var dias_work = document.getElementById("dias_work");
          ttl_din = "(" + diasTrabajados + ") " + contenido;
          dias_work.innerHTML = ttl_din;

          // Mostrar botones y alertas
          imprimir.style.display = "block";
          modificar.style.display = "block";
          document.getElementById("calcular-btn").style.display = "none";
          document.getElementById("mensaje").style.display = "block";

          //Deshabilita campos
          document.getElementById("tramo").disabled = true;
          document.getElementById("nivel").disabled = true;
          document.getElementById("bienios").disabled = true;
          document.getElementById("horas-contrato").disabled = true;
          document.getElementById("dias-trabajados").disabled = true;
          document.getElementById("brp-titulo").disabled = true;
          document.getElementById("brp-mencion").disabled = true;
          document.getElementById("isla-robinson-crusoe").disabled = true;
          document.getElementById("alumnos-prioritarios").disabled = true;
          document.getElementById("rural").disabled = true;

          alert("Tenga presente que debe acreditar sus bienios docentes, su tramo, y sus títulos académicos para obtener las asignaciones respectivas. Recuerde que esta simulación es solo con fines informativos, para mayor detalle contactar con Gestión de Personas.");
        } else {
          alert("No se encontraron datos para la combinación seleccionada.");
        }
      })
      .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
        alert("Error al cargar los datos. Inténtalo de nuevo más tarde.");
      });
  }
});