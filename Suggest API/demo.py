
class Person:
    def __init__(self,name,age,gpa):
        self.name =name
        self.age= age
        self.gpa =gpa
    def introduce(self):
        print(f"Hello my name is : {self.name}, {self.age} years old , GPA: {self.gpa} ")
    def getInput(self):
        self.name=input(f"Name : {self.name}")
        self.age=int(input(f"Age : {self.age}"))
        self.gpa= float(input(f"GPA: {self.gpa}"))
    def __str__(self):
        return f"Person: {self.name}, {self.age}, {self.gpa}"
def InitData(ds,n):
    for a in range(n):
        p = Person("",0,0)
        p.getInput()
        ds.append(p)

def display(ds,n):
    for a in range(n):
        ds[a].introduce()

def findPerson(ds,age):
    result=[]
    for p in ds:
        if p.age==age:
            result.append(p)
    return result
def addPeople(index,ds):
    if index>len(ds):
        print("outbound of range")
    else:
        p =Person("",0,0)
        p.getInput()
        ds.insert(index,p)
        print("add person successful")
def deletePeople(index,ds):
    if index>len(ds):
        print("outbound of range")
    else:
        ds.remove(ds[index])
def main():
    ds=[
        Person("1",10,2),
        Person("2", 13,3),
        Person("3", 14,3),
        Person("4", 15,3.4),
    ]
    ds1=[
        Person("1",20,2.3),
        Person("3",None,3.3)
    ]
    for i,p in enumerate(ds):
        for p1 in ds1:
            if p.name== p1.name:
                ds[i] =p1
    display(ds,len(ds))
main()
