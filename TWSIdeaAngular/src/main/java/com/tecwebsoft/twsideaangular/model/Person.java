package com.tecwebsoft.twsideaangular.model;

import javax.persistence.*;

/**
 * @author Marcelo Lopes Nunes - TWS</br>
 * 		tecwebsoft.com.br - 05/03/2015</br>
 * 		<a href=malito:lopesnunnes@gmail.com>lopesnunnes@gmail.com</a>
 */
@Entity
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id")
    @SequenceGenerator(name = "id", sequenceName = "id")
    private Long id;

    private String name;

    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) { return true; }
        if (o == null || getClass() != o.getClass()) { return false; }

        Person person = (Person) o;

        return id.equals(person.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
