from socket import AF_INET, SOCK_STREAM, socket
from threading import Thread
from tkinter import *
from datetime import datetime
from time import sleep

class GUI:
    def __init__(self, name):
        self.root = Tk()
        self.name = name
        self.request_connect = False
        self.receiving_msg = False 
        self.socket = socket(AF_INET, SOCK_STREAM)
        self.socket.bind(('localhost', 60000))
        self.socket.listen(1)
        self.design_root() 
        self.aceitando_conexoes = Thread(target=self.aceitar_conexao)
        self.aceitando_conexoes.start()
        self.recebedora_msg = Thread(target=self.rcv_msg)
        self.recebedora_msg.start()
        self.root.mainloop()

    def design_root(self):
      
        """Design da tela"""
        self.root.title('Chat P2P de ' + self.name) 
        
        '''Áreas da tela
            - Área de mensagens: espaço para exibir as mensagens recebidas/enviadas;
            - Área de informações: espaço para exibir horário de envio/recebimento.
        '''
        self.msg_area_label = Label(self.root, text='Area de mensagens') 
        self.infos_area_label = Label(self.root, text='Area de informações')

        self.infos_area = Text(self.root, font='Arial 10', width=40, height=14)
        self.chat = Text(self.root, font='Arial 10', width=60, height=14)

        self.input = Entry(self.root, width=60, font='Arial 10')

        self.btn_clear = Button(self.root, text='Limpar mensagens', padx= 40, command=self.clear)
        self.btn_send = Button(self.root, text='Send', padx = 40, command=self.send)
        self.btn_connect = Button(self.root, text='connect', command=self.iniciar_tela_conector)
        self.root.bind("<Return>", self.send) # configura o enter para enviar mensagem
       
        self.msg_area_label.grid(row=0, columnspan=3)
        self.infos_area_label.grid(row=0, columnspan=3, column=3)
        self.infos_area.grid(row=1, column=3, columnspan=3)
        self.chat.grid(row=1, column=0, columnspan=2)
        self.input.grid(row=2, column=0, sticky=W, columnspan=3)
        self.btn_clear.grid(row=2, column=5)
        self.btn_send.grid(row=2, column=3, columnspan=1)    
        self.btn_connect.grid(row=2, column=6)


    def request_connect_(self):
        self.socket.connect((self.ip_dest, 60000))
        self.request_connect = True

        
    def aceitar_conexao(self):
        while(not self.receiving_msg):
            self.destinatario, self.addr = self.socket.accept()
            self.receiving_msg = True
            

    def rcv_msg(self):
        while True:
            try:
                texto = self.destinatario.recv(1024)
                print(texto)
                self.chat.insert(END, texto)
                self.show_date(False)
            except:
               ...
            sleep(2)


    def send(self):
        """Função para enviar mensagem"""
        if self.request_connect:
            
            texto = self.input.get() + '\n'
            self.socket.send(bytes(f'{self.user_name} - {texto}', 'utf-8'))
            self.chat.insert(END, texto)
            self.input.delete(0, END)
            self.show_date(True) # chama a função para exibir a hora.


    def show_date(self, send_rcv):
        """Função para exibir a hora na área de informações
           send_rcv == True  -> Mensagem enviada
           send_rcv == False -> Mensagem recebida"""
        now = datetime.now()
        date_string = now.strftime("%H:%M:%S")
        if send_rcv:
            textoHora = 'Mensagem enviada às: ' + date_string + '\n'
            self.infos_area.insert(END,textoHora)
        else:
            textoHora = 'Mensagem recebida às: ' + date_string + '\n'
            self.infos_area.insert(END,textoHora)
 
    
    def clear(self):
        """Limpa a área de mensagens"""
        self.chat.delete("1.0",END)
        self.infos_area.delete("1.0",END)



    def iniciar_tela_conector(self):
        self.root2 = Tk()
        self.root2.title('Connect config')

        self.user_name_label2 = Label(self.root2,text="Nome de Usuário")
        self.ip_dest_label2 = Label(self.root2, text="IP de destino")

        self.ip_dest_entry2 = Entry(self.root2)
        self.user_name_entry2 = Entry(self.root2) 

        self.btn2 = Button(self.root2, text='connect', command=self.conectar)

        '''Configurações de design'''
       
        self.ip_dest_label2.grid(row=1, sticky=W)
        self.user_name_label2.grid(row=0, column=0, sticky=W)
        self.user_name_entry2.grid(row=0, column=1, sticky=E)
        self.ip_dest_entry2.grid(row=1, column=1, sticky=E)
        self.btn2.grid(row=3, column=1, sticky=E)
        self.root2.mainloop()

    def conectar(self):
        print('iniciando função conectar...')
        self.user_name = self.user_name_entry2.get()
        self.ip_dest = str(self.ip_dest_entry2.get())
        
        fim = Button(self.root2, text='Conexão feita. Clique aqui para fechar!', command=self.root2.destroy).place(x=25, y=15)
        self.request_connect_()

        
tela = GUI('eliab')
tela()


"""Para conseguir se conectar e enviar mensagens é preciso que ambos os lados esteam rodando este código
   funciona como um app P2P que necessita que ambas as partes estejam online enquanto se comunicam."""